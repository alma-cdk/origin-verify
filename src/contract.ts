import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

/**
 * Interface describing the "contract" of return values from the constructor.
 */
export interface IVerification {

  /**
   * CloudFront Origin Custom Header name used in the WAFv2 WebACL verification.
   *
   * @default
   * 'x-origin-verify'
   */
  readonly headerName: string;

  /**
   * Secret Value used as the CloudFront Origin Custom Header value.
   * Obtain the actual value with `toString()` method.
   *
   * @example
   * secretValue.toString()
   */
  readonly secretValue: ISecret['secretValue'];
}