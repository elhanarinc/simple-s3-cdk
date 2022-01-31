const { Stack, Duration } = require('aws-cdk-lib');
const {  } = require('aws-cdk-lib/aws-s3');
// const sqs = require('aws-cdk-lib/aws-sqs');

class SimpleS3CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SimpleS3CdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { SimpleS3CdkStack }
