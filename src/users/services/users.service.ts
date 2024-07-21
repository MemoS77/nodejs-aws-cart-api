import { Injectable } from '@nestjs/common'

import { v4 } from 'uuid'

import { User } from '../models'
import { DBService } from '../../db/db.service'

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  async findOne(userId: string): Promise<User> {
    const user = await this.dbService.query(
      `SELECT id, name, created_at FROM users WHERE id = $1 limit 1`,
      [userId],
    )

    return user.rows[0]
  }

  async createOne({ name }: User): Promise<User> {
    const id = v4()
    const newUser: User = {
      id: name || id,
      name,
      created_at: new Date().toISOString(),
    }

    await this.dbService.query(
      `INSERT INTO users (id, name, created_at) VALUES ($1, $2, $3)`,
      [newUser.id, newUser.name, newUser.created_at],
    )
    return newUser
  }
}
