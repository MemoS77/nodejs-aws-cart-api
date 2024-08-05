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
      DB_USER: process.env.DB_USER!,
      DB_PASS: process.env.DB_PASS!,
      DB_HOST: process.env.DB_HOST!,
      DB_PORT: process.env.DB_PORT!,
      DB_NAME: process.env.DB_NAME!,
    }

    if (
      !environment.DB_USER ||
      !environment.DB_PASS ||
      !environment.DB_HOST ||
      !environment.DB_PORT ||
      !environment.DB_NAME
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
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    })

    new cdk.CfnOutput(this, 'cart', {
      value: api.url,
    })
  }
}
