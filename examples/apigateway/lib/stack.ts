import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { IVerification, OriginVerify } from '@alma-cdk/origin-verify';
import { Api } from './api';
import { CloudFront } from './cloudfront';

export interface DemoStackProps extends StackProps {
  domainName: string;
}

export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props: DemoStackProps) {
    super(scope, id, props);

    const { domainName } = props;

    const zone = HostedZone.fromLookup(this, 'Zone', {
      domainName,
    });

    const api = new Api(this, 'Api', { zone });

    const verification: IVerification = new OriginVerify(this, 'OriginVerify', {
      origin: api.stage,
    });

    new CloudFront(this, 'CloudFront', {
      originUrl: api.domain,
      originVerification: verification,
      zone,
    });

  }
}

