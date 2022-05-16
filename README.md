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


  Enforce API Gateway or Application Load Balancer traffic via CloudFront by generating a Secrets Manager secret value which is used as a CloudFront Origin Custom header and a WAFv2 WebACL header match rule.


  </div>
  <br/>
</div>


![diagram](assets/diagram.svg)

## Work in Progress

🚧 &nbsp;**Do not use for production critial stuff! This construct is still very much work in progress and breaking changes may occur.** 🚧


## Getting Started



```ts
import { OriginVerify } from '@alma-cdk/origin-verify';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';

const api: IRestApi;

const { verifyHeader } = new OriginVerify(this, 'OriginVerify', {
  origin: api.deploymentStage,
});

new Distribution(this, 'CDN', {
  defaultBehavior: { origin: new HttpOrigin(apiDomain, {
    customHeaders: {
      [verifyHeader.name]: verifyHeader.value,
    },
  }) },
})
```
