const { awscdk, github, TextFile, javascript } = require('projen');

const nodejsVersion = '14.17.6';

const project = new awscdk.AwsCdkConstructLibrary({

  // Metadata
  stability: 'experimental',
  authorName: 'Alma Media',
  authorOrganization: true,
  authorAddress: 'opensource@almamedia.dev',
  name: '@alma-cdk/origin-verify',
  description: 'Enforce origin traffic via CloudFront.',
  repositoryUrl: 'https://github.com/alma-cdk/origin-verify.git',
  keywords: ['cdk', 'aws-cdk', 'awscdk', 'aws', 'cloudfront', 'api-gateway', 'application-load-balancer'],

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
  //   python: {
  //     distName: 'alma-cdk.origin-verify',
  //     module: 'alma_cdk.origin_verify',
  //   },
  publishToGo: {
    moduleName: 'github.com/alma-cdk/origin-verify-go',
  },

  // Dependencies
  minNodeVersion: nodejsVersion,
  cdkVersion: '2.24.1',
  constructsVersion: '10.0.0',
  peerDeps: ['constructs', 'aws-cdk-lib'],
  devDeps: [
    'aws-cdk-lib',
    'constructs',
  ],
  bundledDeps: [
  ],

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

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});

new TextFile(project, '.python-version', {
  lines: ['3.11.8'],
});

project.addPackageIgnore('/examples/');


project.synth();
