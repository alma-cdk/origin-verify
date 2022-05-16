import { IResolvable } from 'aws-cdk-lib';
import { IStage } from 'aws-cdk-lib/aws-apigateway';
import { IApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';

/**
 * Origin to "protect" via WAFv2 WebACL request verification.
 * Accepted types:
 * - `IStage` (from `aws-cdk-lib/aws-apigateway`)
 * - `IApplicationLoadBalancer` (from `aws-cdk-lib/aws-elasticloadbalancingv2`)
 */
export type Origin = IStage | IApplicationLoadBalancer;

/**
 * Properties for `OriginVerify` constructor.
 */
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