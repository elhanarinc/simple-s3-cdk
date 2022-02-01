const { Stack, Duration } = require('aws-cdk-lib');
const ecs = require('aws-cdk-lib/aws-ecs');
const ec2 = require('aws-cdk-lib/aws-ec2');
const elasticloadbalancing = require('aws-cdk-lib/aws-elasticloadbalancingv2');

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    
    // get environment and application info
    const clientPrefix = `${props.env.clientName}-${props.env.environment}`;

    // create dedicated VPC
    const vpc = new ec2.Vpc(this, `${clientPrefix}-vpc`, { maxAZs: 2 });

    // create cluster
    const cluster = new ecs.Cluster(this, `${clientPrefix}-cluster`, {
      clusterName: `${clientPrefix}-cluster`,
      vpc
    });

    // add capacity to cluster
    cluster.addCapacity(`${clientPrefix}-cluster-capacity`, {
      instanceType: new ec2.InstanceType('t2.micro'),
      minCapacity: 1,
      maxCapacity: 3
    });

    // create task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, `${clientPrefix}-task-definition`, {});

    // create container with docker image
    const container = taskDefinition.addContainer(`${clientPrefix}-container`, {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/../../app`),
      memoryLimitMiB: 256,
      cpu: 256,
      environment: {
        S3_REGION: props.env.appRegion,
        S3_ACCESS_KEY_ID: props.env.appKey,
        S3_SECRET_ACCESS_KEY: props.env.appSecret,
        S3_BUCKET_NAME: props.env.appBucketName,
        PORT: props.env.appPort
      }
    });

    // add port 80 to container
    container.addPortMappings({ hostPort: 0, containerPort: 80 });

    // create ecs service for deploying task
    const service = new ecs.Ec2Service(this, `${clientPrefix}-service`, {
      cluster,
      desiredCount: 1,
      taskDefinition
    });

    // create an application load balancer
    const alb = new elasticloadbalancing.ApplicationLoadBalancer(this, `${clientPrefix}-alb`, {
      vpc: vpc,
      internetFacing: true
    });

    // create http listener for the application load balancer
    const httpListener = alb.addListener(`${clientPrefix}-http-listener`, { 
      port: 80, 
      open: true, 
      defaultAction: elasticloadbalancing.ListenerAction.fixedResponse(200) 
    });

    // create http listener rule
    const httpListenerRule = new elasticloadbalancing.ApplicationListenerRule(this, `${clientPrefix}-http-listener-rule`, {
      listener: httpListener,
      conditions: [
        elasticloadbalancing.ListenerCondition.pathPatterns(['*']),
      ],
      priority: 1
    });

    // create a target group for attaching ecs tasks
    const targetGroupHttp = new elasticloadbalancing.ApplicationTargetGroup(
      this,
      `${clientPrefix}-target-group`,
      {
        port: 80,
        vpc,
        protocol: elasticloadbalancing.ApplicationProtocol.HTTP
      }
    );

    // add healthcheck for target group
    targetGroupHttp.configureHealthCheck({
      path: "/healthcheck",
      protocol: elasticloadbalancing.Protocol.HTTP,
      timeout: Duration.seconds(15),
      interval: Duration.seconds(30),
      unhealthyThresholdCount: 5,
      healthyThresholdCount: 5
    });

    // add target to target group
    targetGroupHttp.addTarget(service);

    // add target group to listener rule
    httpListenerRule.configureAction(elasticloadbalancing.ListenerAction.forward([targetGroupHttp]));
  }
}

module.exports = { CdkStack }
