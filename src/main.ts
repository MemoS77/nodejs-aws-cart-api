import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Handler, Context } from 'aws-lambda'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Server } from 'http'
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

let server: Server
const instanceId = Math.floor(Math.random() * 100000)

async function bootstrap() {
  const eApp = express()
  const adapter = new ExpressAdapter(eApp)
  const app = await NestFactory.create(AppModule, adapter)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  })
  await app.init()
  console.log(`Bootstrap called #${instanceId}`)
  return awsServerlessExpress.createServer(eApp)
}

export const handler: Handler = async (event: any, context: Context) => {
  console.log(`Handler called #${instanceId}`)
  server = server || (await bootstrap())
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}
