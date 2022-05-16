import { IResolvable, Stack } from 'aws-cdk-lib';
import { IStage } from 'aws-cdk-lib/aws-apigateway';;
import { IApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Secret, ISecret } from 'aws-cdk-lib/aws-secretsmanager';

import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';
import { addError } from './errors/add';

export type Origin = IStage | IApplicationLoadBalancer;

export interface OriginVerifyProps {

  /**
   * Origin to protect.
   *
   * Accepted types:
   * - `IStage` (from `aws-cdk-lib/aws-apigateway`)
   * - `IApplicationLoadBalancer` (from `aws-cdk-lib/aws-elasticloadbalancingv2`)
   **/
  readonly origin: Origin;

  /**
   * The secret which is used to verify the CloudFront distribution.
   * Optional: By default this construct will generate a `new Secret`.
   *
   * @default
   * new Secret()
   **/
  readonly secret?: ISecret;

  /**
   * By default `x-origin-verify` is used. To override it, provide a value for
   * this. Recommendation is to use something with a `x-` prefix.
   *
   * @default
   * 'x-origin-verify'
   **/
  readonly headerName?: string;

  /**
   * Metric name for the WebACL.
   *
   * @default
   * 'OriginVerifyWebAcl'
   */
  readonly aclMetricName?: string;

  /**
   * Metric name for the allowed requests.
   *
   * @default
   * 'OriginVerifyAllowedRequests'
   */
  readonly ruleMetricName?: string;

  /**
   * Any additional rules to add into the created WAFv2 WebACL.
   */
  readonly rules?: (IResolvable | CfnWebACL.RuleProperty)[];
}

export interface VerifyHeader {
  readonly name: string;
  readonly value: string;
}

/**
 * Associates an origin with WAFv2 WebACL to verify traffic contains specific
 * header with a secret value.
 */
export class OriginVerify extends Construct {

  /** Origin Request Header Default Name */
  static readonly OriginVerifyHeader = 'x-origin-verify';

  /** Values to configure into CloudFront origin custom headers. */
  public readonly verifyHeader: VerifyHeader;

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
   * const api: IRestApi;
   *
   * const { verifyHeader } = new OriginVerify(this, 'OriginVerify', {
   *   origin: api,
   * });
   *
   * new Distribution(this, 'CDN', {
   *   defaultBehavior: { origin: new HttpOrigin(apiDomain, {
   *     customHeaders: {
   *       [verifyHeader.name]: verifyHeader.value,
   *     },
   *   }) },
   * })
   */
  constructor(scope: Construct, id: string, props: OriginVerifyProps) {
    super(scope, id);

    // Define the exposed header information
    const secret = this.resolveSecret(props.secret);
    this.verifyHeader = {
      name: props.headerName || OriginVerify.OriginVerifyHeader,
      value: secret.secretValue.toString(),
    };

    const acl = this.defineAcl(this.verifyHeader, props);

    this.associate(acl, this.resolveOriginArn(props.origin));
  }

  /** Generates a new Secrets Manager Secret if none provided via props. */
  private resolveSecret(secret?: ISecret): ISecret {
    if (typeof secret !== 'undefined') {
      return secret;
    }
    return new Secret(this, 'OriginVerifySecret');;
  }

  /** Define a new WAFv2 WebACL. */
  private defineAcl(header: VerifyHeader, props: Pick<OriginVerifyProps, 'aclMetricName'|'ruleMetricName'|'rules' >): CfnWebACL {
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
  private allowCloudFrontRequests(header: VerifyHeader, ruleMetricName?: string): CfnWebACL.RuleProperty {
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
  private allowVerifiedOrigin(header: VerifyHeader): CfnWebACL.StatementProperty {
    return {
      byteMatchStatement: {
        fieldToMatch: {
          singleHeader: {
            Name: header.name,
          },
        },
        searchString: header.value,
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

  /** Resolves origin (either IStage or IApplicationLoadBalancer) ARN. */
  private resolveOriginArn(origin: Origin): string {
    if ('loadBalancerArn' in origin) {
      return origin.loadBalancerArn;
    }
    if ('stageName' in origin) {
      return this.resolveStageArn(origin);
    }
    addError(this, 'Invalid origin: Must be either IStage (API Gateway) or IApplicationLoadBalancer');
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

