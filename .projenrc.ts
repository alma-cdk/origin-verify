import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  // Metadata
  stability: 'experimental',
  author: 'Alma Media',
  authorOrganization: true,
  authorAddress: 'opensource@almamedia.dev',
  name: '@alma-cdk/origin-verify',
  description: 'Enforce origin traffic via CloudFront.',
  repositoryUrl: 'https://github.com/alma-cdk/origin-verify.git',
  keywords: ['cdk', 'aws-cdk', 'awscdk', 'aws', 'cloudfront', 'api-gateway', 'application-load-balancer'],
  projenrcTs: true,
  jsiiVersion: '~5.3.24',
  // Publish configuration
  defaultReleaseBranch: 'main',
  majorVersion: 0,
  releaseBranches: {
    beta: {
      majorVersion: 1,
      prerelease: 'beta',
      npmDistTag: 'beta',
    },
  },
  packageManager: javascript.NodePackageManager.NPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  python: {
    distName: 'alma-cdk.origin-verify',
    module: 'alma_cdk.origin_verify',
  },
  publishToGo: {
    moduleName: 'github.com/alma-cdk/origin-verify-go',
  },

  // Dependencies
  cdkVersion: '2.133.0',
  constructsVersion: '10.3.0',

  // Gitignore
  gitignore: [
    '.DS_Store',
    '/examples/**/cdk.context.json',
    '/examples/**/node_modules',
    '/examples/**/cdk.out',
    '/examples/**/.git',
    '**/*.drawio.bkp',
  ],

});

project.addPackageIgnore('/examples/');


project.synth();
