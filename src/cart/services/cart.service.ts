import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { Cart, CartItem, CartStatuses } from '../models'
import { DBService, QueryItem } from '../../db/db.service'

@Injectable()
export class CartService {
  constructor(private readonly dbService: DBService) {}

  async getCartItems(cartId: string): Promise<CartItem[]> {
    const res = await this.dbService.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [cartId],
    )
    return res.rows
  }

  async findByUserId(userId: string): Promise<Cart> {
    //return this.userCarts[userId]
    const res = await this.dbService.query(
      `SELECT * FROM carts WHERE user_id = $1 and status = 'OPEN' limit 1`,
      [userId],
    )
    if (res.rowCount === 0) return null
    return {
      ...res.rows[0],
      items: await this.getCartItems(res.rows[0].id),
    }
  }

  async createByUserId(userId: string) {
    const id = v4()
    const userCart = {
      id,
      items: [],
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: CartStatuses.OPEN,
    }

    await this.dbService.query(
      `INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4, $5)`,
      [
        userCart.id,
        userCart.user_id,
        userCart.created_at,
        userCart.updated_at,
        userCart.status,
      ],
    )

    return userCart
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId)
    if (userCart) return userCart
    return await this.createByUserId(userId)
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId)

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    }

    const queryList: QueryItem[] = []
    queryList.push({
      query: `update carts set updated_at = $1 WHERE user_id = $2 and status = 'OPEN'`,
      params: [new Date().toISOString(), userId],
    })

    updatedCart.items.forEach((item) => {
      queryList.push({
        query: `insert into cart_items (cart_id, product_id, count) values ($1, $2, $3)`,
        params: [id, item.product.id, item.count],
      })
    })

    await this.dbService.transaction(queryList)

    return { ...updatedCart }
  }

  async removeByUserId(userId) {
    await this.dbService.query(
      `update carts set status = 'ORDERED' WHERE user_id = $1 and status = 'OPEN'`,
      [userId],
    )
  }
}
