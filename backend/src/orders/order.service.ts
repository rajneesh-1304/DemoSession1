import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cartitem.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Products } from '../products/product.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(OrderTracking)
    private readonly orderTrackingRepo: Repository<OrderTracking>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async checkout(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { userId },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let totalAmount = 0;

      const orderItems = cart.items.map((item) => {
        totalAmount += Number(item.product.price) * item.quantity;

        return this.orderItemRepo.create({
          productId: item.product.id,
          productName: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          sellerId: item.sellerId,
        });
      });

      const order = this.orderRepo.create({
        userId,
        totalAmount,
        status: 'PENDING',
        items: orderItems,
      });

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        this.orderTrackingRepo.create({
          order: savedOrder,
          status: 'PENDING',
        }),
      );

      await queryRunner.manager.delete(CartItem, {
        cart: { id: cart.id },
      });

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserOrders(userId: number) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrders() {
    return this.orderRepo.find();
  }

  async getOrderById(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }


  async getOrderBySellerId(id: number) {
    const orderItems = await this.orderItemRepo.find({
      where: { sellerId: id },
    });
    return orderItems;
  }
}
