#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DemoStack } from '../lib/stack';

const app = new cdk.App();

new DemoStack(app, 'DemoStack', {
  env: {
    account: 'TODO',
    region: 'TODO',
  },
  domainName: 'TODO',
});
