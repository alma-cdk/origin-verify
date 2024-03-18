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


# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### OriginVerify <a name="OriginVerify" id="@alma-cdk/origin-verify.OriginVerify"></a>

- *Implements:* <a href="#@alma-cdk/origin-verify.IVerification">IVerification</a>

Associates an origin with WAFv2 WebACL to verify traffic contains specific header with a secret value.

#### Initializers <a name="Initializers" id="@alma-cdk/origin-verify.OriginVerify.Initializer"></a>

```typescript
import { OriginVerify } from '@alma-cdk/origin-verify'

new OriginVerify(scope: Construct, id: string, props: OriginVerifyProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.props">props</a></code> | <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps">OriginVerifyProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@alma-cdk/origin-verify.OriginVerify.Initializer.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/origin-verify.OriginVerifyProps">OriginVerifyProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@alma-cdk/origin-verify.OriginVerify.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@alma-cdk/origin-verify.OriginVerify.isConstruct"></a>

```typescript
import { OriginVerify } from '@alma-cdk/origin-verify'

OriginVerify.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@alma-cdk/origin-verify.OriginVerify.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.property.headerName">headerName</a></code> | <code>string</code> | CloudFront Origin Custom Header name used in the WAFv2 WebACL verification. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.property.headerValue">headerValue</a></code> | <code>string</code> | Secret Value used as the CloudFront Origin Custom Header value. |

---

##### `node`<sup>Required</sup> <a name="node" id="@alma-cdk/origin-verify.OriginVerify.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `headerName`<sup>Required</sup> <a name="headerName" id="@alma-cdk/origin-verify.OriginVerify.property.headerName"></a>

```typescript
public readonly headerName: string;
```

- *Type:* string
- *Default:* 'x-origin-verify'

CloudFront Origin Custom Header name used in the WAFv2 WebACL verification.

---

##### `headerValue`<sup>Required</sup> <a name="headerValue" id="@alma-cdk/origin-verify.OriginVerify.property.headerValue"></a>

```typescript
public readonly headerValue: string;
```

- *Type:* string

Secret Value used as the CloudFront Origin Custom Header value.

---

*Example*

```typescript
'xxxxEXAMPLESECRET'
```


#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerify.property.OriginVerifyHeader">OriginVerifyHeader</a></code> | <code>string</code> | Origin Request Header Default Name. |

---

##### `OriginVerifyHeader`<sup>Required</sup> <a name="OriginVerifyHeader" id="@alma-cdk/origin-verify.OriginVerify.property.OriginVerifyHeader"></a>

```typescript
public readonly OriginVerifyHeader: string;
```

- *Type:* string

Origin Request Header Default Name.

---

## Structs <a name="Structs" id="Structs"></a>

### OriginVerifyProps <a name="OriginVerifyProps" id="@alma-cdk/origin-verify.OriginVerifyProps"></a>

Properties for `OriginVerify` constructor.

#### Initializer <a name="Initializer" id="@alma-cdk/origin-verify.OriginVerifyProps.Initializer"></a>

```typescript
import { OriginVerifyProps } from '@alma-cdk/origin-verify'

const originVerifyProps: OriginVerifyProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.origin">origin</a></code> | <code>aws-cdk-lib.aws_apigateway.IStage \| aws-cdk-lib.aws_elasticloadbalancingv2.IApplicationLoadBalancer \| aws-cdk-lib.aws_appsync.CfnGraphQLApi</code> | Origin to protect. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.aclMetricName">aclMetricName</a></code> | <code>string</code> | Metric name for the WebACL. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.headerName">headerName</a></code> | <code>string</code> | By default `x-origin-verify` is used. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.ruleMetricName">ruleMetricName</a></code> | <code>string</code> | Metric name for the allowed requests. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.rules">rules</a></code> | <code>aws-cdk-lib.IResolvable \| aws-cdk-lib.aws_wafv2.CfnWebACL.RuleProperty[]</code> | Any additional rules to add into the created WAFv2 WebACL. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.secretValue">secretValue</a></code> | <code>aws-cdk-lib.SecretValue</code> | The secret which is used to verify the CloudFront distribution. |

---

##### `origin`<sup>Required</sup> <a name="origin" id="@alma-cdk/origin-verify.OriginVerifyProps.property.origin"></a>

```typescript
public readonly origin: IStage | IApplicationLoadBalancer | CfnGraphQLApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.IStage | aws-cdk-lib.aws_elasticloadbalancingv2.IApplicationLoadBalancer | aws-cdk-lib.aws_appsync.CfnGraphQLApi

Origin to protect.

Accepted types:
- `IStage` (from `aws-cdk-lib/aws-apigateway`)
- `IApplicationLoadBalancer` (from `aws-cdk-lib/aws-elasticloadbalancingv2`)

---

##### `aclMetricName`<sup>Optional</sup> <a name="aclMetricName" id="@alma-cdk/origin-verify.OriginVerifyProps.property.aclMetricName"></a>

```typescript
public readonly aclMetricName: string;
```

- *Type:* string
- *Default:* 'OriginVerifyWebAcl'

Metric name for the WebACL.

---

##### `headerName`<sup>Optional</sup> <a name="headerName" id="@alma-cdk/origin-verify.OriginVerifyProps.property.headerName"></a>

```typescript
public readonly headerName: string;
```

- *Type:* string
- *Default:* 'x-origin-verify'

By default `x-origin-verify` is used.

To override it, provide a value for
this. Recommendation is to use something with a `x-` prefix.

---

##### `ruleMetricName`<sup>Optional</sup> <a name="ruleMetricName" id="@alma-cdk/origin-verify.OriginVerifyProps.property.ruleMetricName"></a>

```typescript
public readonly ruleMetricName: string;
```

- *Type:* string
- *Default:* 'OriginVerifyAllowedRequests'

Metric name for the allowed requests.

---

##### `rules`<sup>Optional</sup> <a name="rules" id="@alma-cdk/origin-verify.OriginVerifyProps.property.rules"></a>

```typescript
public readonly rules: IResolvable | RuleProperty[];
```

- *Type:* aws-cdk-lib.IResolvable | aws-cdk-lib.aws_wafv2.CfnWebACL.RuleProperty[]

Any additional rules to add into the created WAFv2 WebACL.

---

##### `secretValue`<sup>Optional</sup> <a name="secretValue" id="@alma-cdk/origin-verify.OriginVerifyProps.property.secretValue"></a>

```typescript
public readonly secretValue: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue
- *Default:* new Secret().secretValue

The secret which is used to verify the CloudFront distribution.

Optional: By default this construct will generate a `new Secret`.

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IVerification <a name="IVerification" id="@alma-cdk/origin-verify.IVerification"></a>

- *Implemented By:* <a href="#@alma-cdk/origin-verify.OriginVerify">OriginVerify</a>, <a href="#@alma-cdk/origin-verify.IVerification">IVerification</a>

Interface describing the "contract" of return values from the constructor.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/origin-verify.IVerification.property.headerName">headerName</a></code> | <code>string</code> | CloudFront Origin Custom Header name used in the WAFv2 WebACL verification. |
| <code><a href="#@alma-cdk/origin-verify.IVerification.property.headerValue">headerValue</a></code> | <code>string</code> | Secret Value used as the CloudFront Origin Custom Header value. |

---

##### `headerName`<sup>Required</sup> <a name="headerName" id="@alma-cdk/origin-verify.IVerification.property.headerName"></a>

```typescript
public readonly headerName: string;
```

- *Type:* string
- *Default:* 'x-origin-verify'

CloudFront Origin Custom Header name used in the WAFv2 WebACL verification.

---

##### `headerValue`<sup>Required</sup> <a name="headerValue" id="@alma-cdk/origin-verify.IVerification.property.headerValue"></a>

```typescript
public readonly headerValue: string;
```

- *Type:* string

Secret Value used as the CloudFront Origin Custom Header value.

---

*Example*

```typescript
'xxxxEXAMPLESECRET'
```


