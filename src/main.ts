import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  })

  await app.listen(PORT)
  console.log(`App on http://localhost:${PORT}`)
}

bootstrap()
