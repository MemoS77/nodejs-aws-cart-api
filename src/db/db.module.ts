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
        const pool = new Pool({
          host: process.env.PG_HOST,
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DATABASE,
          port: +(process.env.PG_PORT || 5432),
          max: +(process.env.PG_POOL_SIZE || 10),
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        })

        return pool
      },
    },
  ],
  exports: ['POSTGRES', DBService],
})
export class DBModule {}
