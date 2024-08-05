import { Global, Module } from '@nestjs/common'
import { DBService } from './db.service'
import { Pool } from 'pg'

@Global()
@Module({
  providers: [
    DBService,
    {
      provide: 'POSTGRES',
      useFactory: async () => {
        console.log('Creating DB Pool', process.env)
        const pool = new Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          port: +(process.env.PG_PORT || 5432),
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000,
        })

        return pool
      },
    },
  ],
  exports: ['POSTGRES', DBService],
})
export class DBModule {}
