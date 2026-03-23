import { AlmaCdkConstructLibrary } from "@alma-cdk/construct-library";
import { cdk } from "projen";

const project = new AlmaCdkConstructLibrary({
  name: "@alma-cdk/origin-verify",
  author: "Alma Media",
  authorAddress: "opensource@almamedia.dev",
  description: "Enforce origin traffic via CloudFront.",
  repositoryUrl: "https://github.com/alma-cdk/origin-verify.git",
  stability: cdk.Stability.EXPERIMENTAL,
  majorVersion: 1,
  releaseEnvironment: "production",
  keywords: [
    "cdk",
    "aws-cdk",
    "awscdk",
    "aws",
    "cloudfront",
    "api-gateway",
    "application-load-balancer",
  ],

  //   python: {
  //     distName: 'alma-cdk.origin-verify',
  //     module: 'alma_cdk.origin_verify',
  //   },
  // publishToGo: {
  //   moduleName: 'github.com/alma-cdk/origin-verify-go',
  // },

  devDeps: ["aws-cdk-lib", "constructs", "@alma-cdk/construct-library"],
  bundledDeps: [],
});

project.addPackageIgnore("/examples/");

project.synth();
