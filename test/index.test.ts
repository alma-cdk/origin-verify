import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { OriginVerify } from '../src/index';

test('Allow ALB', () => {
  const app = new App();
  const stack = new Stack(app);

  const vpc = new Vpc(stack, 'Vpc');

  const alb = new ApplicationLoadBalancer(stack, 'ALB', {
    vpc,
    internetFacing: true,
  });

  new OriginVerify(stack, 'OriginVerify', {
    origin: alb,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Block: {},
    },
  });
});

test('Allow Stage', () => {
  const app = new App();
  const stack = new Stack(app);

  const api = new RestApi(stack, 'RestApi', {});
  api.root.addMethod('ANY');

  new OriginVerify(stack, 'OriginVerify', {
    origin: api.deploymentStage,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Block: {},
    },
  });
});
