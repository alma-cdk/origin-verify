# Example setup with API Gateway

1. Clone this project
2. Go to this example folder: `cd examples/apigateway`
3. Run `npm install`
4. Modify `bin/app.ts`:
  - AWS `account` ID
  - AWS `region`
  - (Base) `domainName` – must be some domain managed by Route53 zone in your AWS account
5. Deploy with `npx cdk deploy`
6. Test via some HTTP-client:
  - `https://apigw.<domainName>` returns `403 Forbidden`
  - `https://cloudfront.<domainName>` returns `200 Ok`
