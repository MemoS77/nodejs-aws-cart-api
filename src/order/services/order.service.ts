import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import { Order } from '../models'
import { DBService } from '../../db/db.service'

@Injectable()
export class OrderService {
  constructor(private dbService: DBService) {}

  async findById(orderId: string): Promise<Order> {
    const order = await this.dbService.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId],
    )

    return order.rows[0]
  }

  async create(data: any) {
    const id = v4()
    const order = {
      ...data,
      id,
      status: 'inProgress',
    }

    await this.dbService.query(
      'INSERT INTO orders(id, user_id, cart_id, status, total, delivery, comments) VALUES($1, $2, $3, $4)',
      [
        id,
        order.userId,
        order.cartId,
        order.status,
        order.total ?? 0,
        order.delivery ?? null,
        order.comments ?? null,
      ],
    )

    return order
  }
}
