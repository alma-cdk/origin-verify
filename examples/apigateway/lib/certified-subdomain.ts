import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export interface CertifiedSubdomainProps {
  zone: route53.IHostedZone;
  subdomain: string;
  region?: string;
}

export class CertifiedSubdomain extends Construct {
  public readonly certificate: acm.ICertificate;
  public readonly fqdn: string;
  private readonly zone: route53.IHostedZone;
  private readonly subdomain: string;
  private readonly region: string;

  constructor(scope: Construct, id: string, props: CertifiedSubdomainProps) {
    super(scope, id);

    const currentRegion = Stack.of(scope).region;

    this.zone = props.zone;
    this.subdomain = props.subdomain;
    this.region = props.region || currentRegion;
    this.fqdn = `${this.subdomain}.${this.zone.zoneName}`;

    if (this.region !== currentRegion) {
      // for cross-region certs we must use a different CDK construct
      this.certificate = new acm.DnsValidatedCertificate(this, 'CrossRegionCertificate', {
        domainName: this.fqdn,
        hostedZone: this.zone,
        region: this.region,
      });
    } else {
      // same-region certs can use the default Certificate construct
      this.certificate = new acm.Certificate(this, 'Certificate', {
        domainName: this.fqdn,
        validation: acm.CertificateValidation.fromDns(this.zone),
      });
    }

  }

  public addTarget(alias: route53.IAliasRecordTarget): void {
    new route53.ARecord(this, 'AliasRecord', {
      zone: this.zone,
      recordName: this.subdomain,
      target: route53.RecordTarget.fromAlias(alias),
    });
  }
}
