import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartitem.entity';
import { Products } from '../products/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,

  ) {}

  async getCart(userId:number){
    let cart =await this.cartRepo.findOne({
        where:{userId},
        relations:['items', 'items.product'],
    })

    if(!cart){
        cart=this.cartRepo.create({userId, items:[]});
        await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addToCart(cartData: any){
    if(cartData.quantity<=0){
        throw new BadRequestException('Quantity must be greater than 0');
    }

    const product = await this.productRepo.findOne({
        where : {id:cartData.productId},
    });

    if(!product){
        throw new NotFoundException('Product not found');
    }

    let cart = await this.cartRepo.findOne({
        where:{userId : cartData.userId},
        relations:['items', 'items.product'],
    })

    if (!cart) {
      cart = this.cartRepo.create({ userId: cartData.userId, items: [] });
      await this.cartRepo.save(cart);
    }

    const existingItem = cart.items.find(
      item => item.product.id === cartData.productId,
    );

    if (existingItem) {
      existingItem.quantity += cartData.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const cartItem = this.cartItemRepo.create({
        cart,
        product,
        quantity: cartData.quantity,
        sellerId: cartData.sellerId,
      });
      await this.cartItemRepo.save(cartItem);
    }

    return this.getCart(cartData.userId);
  }

   async updateQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const item = await this.cartItemRepo.findOne({
      where: { id: itemId },
      relations: ['cart'],
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = quantity;
    await this.cartItemRepo.save(item);

    return this.getCart(item.cart.userId);
  }


  async removeItem(itemId: number) {
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId },
      relations: ['cart'],
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const userId = item.cart.userId;
    await this.cartItemRepo.remove(item);

    return this.getCart(userId);
  }


  async clearCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemRepo.delete({ cart: { id: cart.id } });

    return {
      message: 'Cart cleared successfully',
    };
  }
}