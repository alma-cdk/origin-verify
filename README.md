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


  Enforce API Gateway or Application Load Balancer traffic via CloudFront.


  </div>
  <br/>
</div>

## Work in Progress

🚧 &nbsp;**Do not use for production critial stuff! This construct is still very much work in progress and breaking changes may occur.** 🚧


## Getting Started



```ts
import { OriginVerify } from '@alma-cdk/origin-verify';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';

const api: IRestApi;

const { verifyHeader } = new OriginVerify(this, 'OriginVerify', {
  origin: api,
});

new Distribution(this, 'CDN', {
  defaultBehavior: { origin: new HttpOrigin(apiDomain, {
    customHeaders: {
      [verifyHeader.name]: verifyHeader.value,
    },
  }) },
})
```
