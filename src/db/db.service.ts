import { Injectable, Inject } from '@nestjs/common'
import { Pool } from 'pg'

@Injectable()
export class DBService {
  constructor(@Inject('POSTGRES') private readonly pool: Pool) {}

  async query(queryText: string, params?: any[]) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(queryText, params)
      return res
    } finally {
      client.release()
    }
  }

  async transaction(queries: { query: string; params?: any[] }[]) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const results = []
      for (const { query, params } of queries) {
        const res = await client.query(query, params)
        results.push(res)
      }
      await client.query('COMMIT')
      return results
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
