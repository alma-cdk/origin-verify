import { Construct } from 'constructs';
import { Distribution, PriceClass, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IVerification } from '@alma-cdk/origin-verify';
import { CertifiedSubdomain } from './certified-subdomain';

interface CloudFrontProps {
  originUrl: string;
  originVerification: IVerification;
  zone: IHostedZone;
}

export class CloudFront extends Construct {

  constructor(scope: Construct, id: string, props: CloudFrontProps) {
    super(scope, id);

    const { originUrl, originVerification, zone } = props;

    const subdomain = new CertifiedSubdomain(this, 'CloudFront', {
      zone,
      subdomain: 'cloudfront',
      region: 'us-east-1',
    });

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new HttpOrigin(originUrl, {
          customHeaders: {
            [originVerification.headerName]: originVerification.headerValue,
          },
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        })
      },
      priceClass: PriceClass.PRICE_CLASS_100,
      certificate: subdomain.certificate,
      domainNames: [subdomain.fqdn],
    })

    subdomain.addTarget(new targets.CloudFrontTarget(distribution));

  }
}
