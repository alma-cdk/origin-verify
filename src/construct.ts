import { SecretValue, Stack } from 'aws-cdk-lib';
import { IStage } from 'aws-cdk-lib/aws-apigateway';
import { CfnGraphQLApi } from 'aws-cdk-lib/aws-appsync';
import { IApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';
import { IVerification } from './contract';
import { addError } from './errors/add';
import { Origin, OriginVerifyProps } from './props';

/**
 * Associates an origin with WAFv2 WebACL to verify traffic contains specific
 * header with a secret value.
 */
export class OriginVerify extends Construct implements IVerification {
  /** Origin Request Header Default Name */
  static readonly OriginVerifyHeader = 'x-origin-verify';

  /**
   * CloudFront Origin Custom Header name used in the WAFv2 WebACL verification.
   *
   * @default
   * 'x-origin-verify'
   */
  public readonly headerName: string;

  /**
   * Secret Value used as the CloudFront Origin Custom Header value.
   *
   * @example
   * 'xxxxEXAMPLESECRET'
   */
  public readonly headerValue: string;

  /**
   * Associates an origin with WAFv2 WebACL to verify traffic contains specific
   * header with a secret value.
   *
   * Use `verifyHeader` value to assign custom headers into CloudFront config.
   *
   * @example
   * import { OriginVerify } from '@alma-cdk/origin-verify';
   * import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
   *
   * const api: RestApi; // TODO: implement the RestApi
   * const apiDomain: string; // TODO: implement the domain
   *
   * const verification = new OriginVerify(this, 'OriginVerify', {
   *   origin: api.deploymentStage,
   * });
   *
   * new Distribution(this, 'CDN', {
   *   defaultBehavior: {
   *     origin: new HttpOrigin(apiDomain, {
   *       customHeaders: {
   *         [verification.headerName]: verification.headerValue,
   *       },
   *       protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
   *     })
   *   },
   * })
   */
  constructor(scope: Construct, id: string, props: OriginVerifyProps) {
    super(scope, id);

    // Define the exposed header information
    const secretValue = this.resolveSecret(props.secretValue);
    const verifyHeader: IVerification = {
      headerName: props.headerName || OriginVerify.OriginVerifyHeader,
      headerValue: secretValue.unsafeUnwrap(),
    };

    this.headerName = verifyHeader.headerName;
    this.headerValue = verifyHeader.headerValue;

    const acl = this.defineAcl(verifyHeader, props);

    this.associate(acl, this.resolveOriginArn(props.origin));
  }

  /** Generates a new Secrets Manager Secret if none provided via props. */
  private resolveSecret(secret?: SecretValue): SecretValue {
    if (typeof secret !== 'undefined') {
      return secret;
    }
    return new Secret(this, 'OriginVerifySecret').secretValue;
  }

  /** Define a new WAFv2 WebACL. */
  private defineAcl(
    header: IVerification,
    props: Pick<OriginVerifyProps, 'aclMetricName' | 'ruleMetricName' | 'rules'>,
  ): CfnWebACL {
    return new CfnWebACL(this, 'WebACL', {
      defaultAction: {
        block: {},
      },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true, // TODO should it be configurable?
        metricName: props.aclMetricName || 'OriginVerifyWebAcl', // TODO can these clash?
        sampledRequestsEnabled: true, // TODO should it be configurable?
      },
      rules: [
        ...(props.rules || []),
        this.allowCloudFrontRequests(header, props.ruleMetricName),
      ],
    });
  }

  /** Allow traffic with specific header secret. */
  private allowCloudFrontRequests(
    header: IVerification,
    ruleMetricName?: string,
  ): CfnWebACL.RuleProperty {
    return {
      name: 'AllowCloudFrontRequests',
      priority: 0,
      visibilityConfig: {
        cloudWatchMetricsEnabled: false, // TODO ??
        metricName: ruleMetricName || 'OriginVerifyAllowedRequests', // TODO can these clash?
        sampledRequestsEnabled: false, // TODO ??
      },
      action: {
        allow: {},
      },
      statement: this.allowVerifiedOrigin(header),
    };
  }

  /** Define WAFv2 Statement matching specific header and its value. */
  private allowVerifiedOrigin(
    header: IVerification,
  ): CfnWebACL.StatementProperty {
    return {
      byteMatchStatement: {
        fieldToMatch: {
          singleHeader: {
            Name: header.headerName,
          },
        },
        // Use of unsafeUnwrap allowed as we must be able to assign the secret
        // value into WebACL rule (and that rule stays within AWS Account).
        searchString: header.headerValue,
        positionalConstraint: 'EXACTLY',
        textTransformations: [
          {
            priority: 0,
            type: 'NONE',
          },
        ],
      },
    };
  }

  /** Associates a WAFv2 WebACL into an AWS Resource (defined by ARN). */
  private associate(acl: CfnWebACL, arn: string): void {
    new CfnWebACLAssociation(this, 'WebACLAssociation', {
      webAclArn: acl.attrArn,
      resourceArn: arn,
    });
  }

  /** Type guard for Application Load Balancer. */
  private isAlb(origin: Origin): origin is IApplicationLoadBalancer {
    return 'loadBalancerArn' in origin;
  }

  /** Type guard for API Gateway Stage. */
  private isStage(origin: Origin): origin is IStage {
    return 'stageName' in origin;
  }

  //** Type guard for AppSync GraphQL API. */
  private isCfnGraphQLApi(origin: Origin): origin is CfnGraphQLApi {
    return 'attrGraphQlUrl' in origin;
  }

  /** Resolves origin (either IStage or IApplicationLoadBalancer) ARN. */
  private resolveOriginArn(origin: Origin): string {
    if (this.isAlb(origin)) {
      return origin.loadBalancerArn;
    }
    if (this.isStage(origin)) {
      return this.resolveStageArn(origin);
    }
    if (this.isCfnGraphQLApi(origin)) {
      return origin.attrArn;
    }
    addError(
      this,
      'Invalid origin: Must be either Api Gateway IStage, IApplicationLoadBalancer or AppSync CfnGraphQLApi',
    );
    return '';
  }

  /** Formates API Gateway Stage ARN. */
  private resolveStageArn(stage: IStage): string {
    const region = Stack.of(stage).region;
    const apiId = stage.restApi.restApiId;
    const stageName = stage.stageName;
    return `arn:aws:apigateway:${region}::/restapis/${apiId}/stages/${stageName}`;
  }
}
