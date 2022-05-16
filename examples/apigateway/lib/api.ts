import { Construct } from 'constructs';
import { RestApi, EndpointType, HttpIntegration, IStage } from 'aws-cdk-lib/aws-apigateway';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { CertifiedSubdomain } from './certified-subdomain';

interface ApiProps {
  zone: IHostedZone;
}

export class Api extends Construct {
  public readonly domain: string;
  public readonly stage: IStage;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const { zone } = props;

    const subdomain = new CertifiedSubdomain(this, 'ApiGateway', {
      zone,
      subdomain: 'apigw',
    });

    const api = new RestApi(this, 'API', {
      deployOptions: {
        stageName: 'live',
      },
      domainName: {
        domainName: subdomain.fqdn,
        certificate: subdomain.certificate,
        endpointType: EndpointType.REGIONAL,
      },
    });

    api.root.addMethod('ANY', new HttpIntegration('http://example.com'));
    subdomain.addTarget(new targets.ApiGateway(api));

    this.domain = subdomain.fqdn;
    this.stage = api.deploymentStage;
  }
}
