import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Products } from '../../products/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Products, {
    eager: true,
  })
  product: Products;

  @Column()
  quantity: number;

  @Column()
  sellerId: number;
}
