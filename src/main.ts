import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'

const port = process.env.PORT || 4000
const qTimeout = 20000

let serverInstance
let lastQTime = Date.now()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  })
  app.use(helmet())

  // Middleware для обновления времени последнего запроса
  app.use((_req, _res, next) => {
    console.log('q!')
    lastQTime = Date.now()
    next()
  })

  serverInstance = await app.listen(port)
  console.log(`App is running on http://localhost:${port}`)
}

bootstrap()

// For prevent lost money in this curs? we don't need to run server all time in warm mode.
// More cheaper it's shutting down/ We can wait for cold launch in each queries

setInterval(() => {
  if (shouldShutdown()) {
    console.log('No queries for long time, shutting down...')
    process.exit(0) // Применяется на локальном сервере
  }
}, qTimeout)

function shouldShutdown() {
  return Date.now() - lastQTime >= qTimeout
}
