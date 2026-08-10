import { AlmaCdkConstructLibrary } from "@alma-cdk/construct-library";
import { cdk } from "projen";

const MAJOR_VERSION = 2;
const NEXT_MAJOR_VERSION = MAJOR_VERSION + 1;

const project = new AlmaCdkConstructLibrary({
  name: "@alma-cdk/origin-verify",
  author: "Alma Media",
  authorAddress: "opensource@almamedia.dev",
  description: "Enforce origin traffic via CloudFront.",
  repositoryUrl: "https://github.com/alma-cdk/origin-verify.git",
  stability: cdk.Stability.EXPERIMENTAL,
  majorVersion: MAJOR_VERSION,
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

  devDeps: ["aws-cdk-lib", "constructs", "@alma-cdk/construct-library"],
  bundledDeps: [],
  releaseBranches: {
    [`${NEXT_MAJOR_VERSION}.x`]: {
      majorVersion: NEXT_MAJOR_VERSION,
      prerelease: "beta",
      npmDistTag: "beta",
    },
  },
});

project.addPackageIgnore("/examples/");

project.synth();
