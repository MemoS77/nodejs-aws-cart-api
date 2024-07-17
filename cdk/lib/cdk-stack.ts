import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    //const lambdaZipPath = path.join(__dirname, '../lambda-package
    const nestLambda = new lambda.Function(this, 'NestCartLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'bundle.handler',
      code: lambda.Code.fromAsset('../dist'),
      timeout: cdk.Duration.seconds(15),
    })

    const api = new apigateway.LambdaRestApi(this, 'NestCartApi', {
      handler: nestLambda,
      proxy: true,
    })

    new cdk.CfnOutput(this, 'cart', {
      value: api.url,
    })
  }
}
