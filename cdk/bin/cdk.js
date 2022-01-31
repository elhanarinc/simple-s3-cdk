#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { CdkStack } = require('../lib/cdk-stack');

require('dotenv').config();

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { 
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    clientName: process.env.CDK_CLIENT_NAME,
    environment: process.env.CDK_PROJECT_ENV,

    appRegion: process.env.REGION,
    appKey: process.env.ACCESS_KEY_ID,
    appSecret: process.env.SECRET_ACCESS_KEY,
    appBucketName: process.env.BUCKET_NAME,
    appPort: process.env.PORT
  },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
