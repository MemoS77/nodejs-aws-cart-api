import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

import { config } from 'dotenv'

config()

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const environment = {
      dbUser: process.env.DB_USER!,
      dbPass: process.env.DB_PASS!,
      dbHost: process.env.DB_HOST!,
      dbPort: process.env.DB_PORT!,
      dbName: process.env.DB_NAME!,
    }

    if (
      !environment.dbUser ||
      !environment.dbPass ||
      !environment.dbHost ||
      !environment.dbPort ||
      !environment.dbName
    ) {
      throw new Error('DB data is not set')
    }

    const nestLambda = new lambda.Function(this, 'NestCartLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'bundle.handler',
      code: lambda.Code.fromAsset('../dist'),
      timeout: cdk.Duration.seconds(15),
      environment: environment,
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
