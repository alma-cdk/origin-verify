import { TextFile, awscdk, javascript } from 'projen';
import { WorkflowSteps } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';

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

/**
 * Sonarcloud report workflow
 */
const sonarCloudReportWorkflow = project.github?.addWorkflow('sonarcloud-report');
sonarCloudReportWorkflow?.on({
  push: { branches: ['main', 'beta'] },
  pullRequest: {
    types: ['opened', 'synchronize', 'reopened'],
  },
});
sonarCloudReportWorkflow?.addJob('sonarcloud-report', {
  runsOn: ['ubuntu-latest'],
  permissions: {
    contents: JobPermission.READ,
  },
  steps: [
    WorkflowSteps.checkout({
      with: {
        fetchDepth: 0,
      },
    }),
    ...project.renderWorkflowSetup(),
    {
      name: 'Run tests',
      run: 'npm run test',
    },
    {
      name: 'SonarCloud Scan',
      uses: 'SonarSource/sonarcloud-github-action@v2',
      env: {
        GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
        SONAR_TOKEN: '${{ secrets.SONAR_TOKEN }}',
      },
    },
  ],
});

/**
 * Sonarcloud properties file
 */
new TextFile(project, 'sonar-project.properties', {
  lines: [
    'sonar.host.url=https://sonarcloud.io',
    `sonar.projectKey=${project.name.replace('@', '').replace('/', '_')}`,
    `sonar.organization=${project.name.replace('@', '').split('/')[0]}`,
    'sonar.javascript.lcov.reportPaths=./coverage/lcov.info',
    'sonar.sources=./src',
    'sonar.tests=./test',
  ],
});

/**
 * .nvmrc file
 */
new TextFile(project, '.nvmrc', {
  lines: ['20.11.1'],
});


project.synth();
