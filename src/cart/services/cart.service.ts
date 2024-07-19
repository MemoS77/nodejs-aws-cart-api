import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { Cart, CartStatuses } from '../models'
import { DBService } from '../../db/db.service'

@Injectable()
export class CartService {
  constructor(private readonly dbService: DBService) {}
  private userCarts: Record<string, Cart> = {}

  findByUserId(userId: string): Cart {
    return this.userCarts[userId]
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

    await this.dbService.transaction([
      {
        query: `INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4, $5)`,
        params: [
          userCart.id,
          userCart.user_id,
          userCart.created_at,
          userCart.updated_at,
          userCart.status,
        ],
      },
    ])
    this.userCarts[userId] = userCart

    return userCart
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = this.findByUserId(userId)

    if (userCart) {
      return userCart
    }

    return await this.createByUserId(userId)
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId)

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    }

    this.userCarts[userId] = { ...updatedCart }

    return { ...updatedCart }
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null
  }
}
