<div align="center">
	<br/>
	<br/>
  <h1>
	<img height="140" src="assets/alma-cdk-origin-verify.svg" alt="Alma CDK Origin Verify" />
  <br/>
  <br/>
  </h1>

  ```sh
  npm i -D @alma-cdk/origin-verify
  ```

  <div align="left">


  Enforce API Gateway REST API, AppSync GraphQL API, or Application Load Balancer traffic via CloudFront by generating a Secrets Manager secret value which is used as a CloudFront Origin Custom header and a WAFv2 WebACL header match rule.

  </div>
  <br/>
</div>

<br/>

![diagram](assets/diagram.svg)

<br/>

Essentially this is an implementation of _AWS Solution_ “[Enhance Amazon CloudFront Origin Security with AWS WAF and AWS Secrets Manager](https://aws.amazon.com/blogs/security/how-to-enhance-amazon-cloudfront-origin-security-with-aws-waf-and-aws-secrets-manager/)” without the secret rotation.

<br/>

## 🚧 &nbsp; Project Stability

![experimental](https://img.shields.io/badge/stability-experimental-yellow "Stability: Experimental")

This construct is still versioned with `v0` major version and breaking changes might be introduced if necessary (without a major version bump), though we aim to keep the API as stable as possible (even within `v0` development). We aim to publish `v1.0.0` soon and after that breaking changes will be introduced via major version bumps.


<br/>

## Getting Started

```ts
import { OriginVerify } from '@alma-cdk/origin-verify';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
```
```ts
const api: RestApi; // TODO: implement the RestApi
const apiDomain: string; // TODO: implement the domain

const verification = new OriginVerify(this, 'OriginVerify', {
  origin: api.deploymentStage,
});

new Distribution(this, 'CDN', {
  defaultBehavior: {
    origin: new HttpOrigin(apiDomain, {
      customHeaders: {
        [verification.headerName]: verification.headerValue,
      },
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })
  },
})
```

For more detailed example usage see [`/examples`](https://github.com/alma-cdk/origin-verify/tree/main/examples/) directory.

<br/>

## Custom Secret Value

Additionally, you may pass in custom `secretValue` if you don't want to use a generated secret (which you should use in most cases):

```ts
const myCustomValue = SecretValue.unsafePlainText('foobar');

const verification = new OriginVerify(this, 'OriginVerify', {
  origin: api.deploymentStage,
  secretValue: myCustomValue,
});
```


<br/>

## Notes

### Use `OriginProtocolPolicy.HTTPS_ONLY`!

In your CloudFront distribution Origin configuration use `OriginProtocolPolicy.HTTPS_ONLY` to avoid exposing the `verification.headerValue` secret to the world.

### Why `secretValue.unsafeUnwrap()`?

Internally this construct creates the `headerValue` by using AWS Secrets Manager but the secret value is exposed directly by using `secretValue.unsafeUnwrap()` method: This is:
- **required**, because we must be able to set it into the WAFv2 WebACL rule
- **required**, because you must be able to set it into the CloudFront Origin Custom Header
- **okay**, because it's meant to protect the API externally and it's _not_ considered as a secret that should be kept – well – secret within _your_ AWS account

