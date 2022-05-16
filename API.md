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

##### ~~`isConstruct`~~ <a name="isConstruct" id="@alma-cdk/origin-verify.OriginVerify.isConstruct"></a>

```typescript
import { OriginVerify } from '@alma-cdk/origin-verify'

OriginVerify.isConstruct(x: any)
```

Checks if `x` is a construct.

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
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.origin">origin</a></code> | <code>aws-cdk-lib.aws_apigateway.IStage \| aws-cdk-lib.aws_elasticloadbalancingv2.IApplicationLoadBalancer</code> | Origin to protect. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.aclMetricName">aclMetricName</a></code> | <code>string</code> | Metric name for the WebACL. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.headerName">headerName</a></code> | <code>string</code> | By default `x-origin-verify` is used. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.ruleMetricName">ruleMetricName</a></code> | <code>string</code> | Metric name for the allowed requests. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.rules">rules</a></code> | <code>aws-cdk-lib.aws_wafv2.CfnWebACL.RuleProperty \| aws-cdk-lib.IResolvable[]</code> | Any additional rules to add into the created WAFv2 WebACL. |
| <code><a href="#@alma-cdk/origin-verify.OriginVerifyProps.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | The secret which is used to verify the CloudFront distribution. |

---

##### `origin`<sup>Required</sup> <a name="origin" id="@alma-cdk/origin-verify.OriginVerifyProps.property.origin"></a>

```typescript
public readonly origin: IStage | IApplicationLoadBalancer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IStage | aws-cdk-lib.aws_elasticloadbalancingv2.IApplicationLoadBalancer

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
public readonly rules: RuleProperty | IResolvable[];
```

- *Type:* aws-cdk-lib.aws_wafv2.CfnWebACL.RuleProperty | aws-cdk-lib.IResolvable[]

Any additional rules to add into the created WAFv2 WebACL.

---

##### `secret`<sup>Optional</sup> <a name="secret" id="@alma-cdk/origin-verify.OriginVerifyProps.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret
- *Default:* new Secret()

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


