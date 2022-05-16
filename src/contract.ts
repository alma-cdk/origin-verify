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
   *
   * @example
   * 'xxxxEXAMPLESECRET'
   */
  readonly headerValue: string;
}