import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderTracking } from './order-tracking.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'ACCEPT' | 'PREPARING' | 'DELIVERED';

  @OneToMany(() => OrderItem, item => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @OneToMany(() => OrderTracking, track => track.order, {
    cascade: true,
    eager: true,
  })
  tracking: OrderTracking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
