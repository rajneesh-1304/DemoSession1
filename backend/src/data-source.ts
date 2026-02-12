import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './users/user.entity';
import { Products } from './products/product.entity';
import { Address } from './address/address.entity';
import { CartItem } from './cart/entities/cartitem.entity';
import { Cart } from './cart/entities/cart.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderTracking } from './orders/entities/order-tracking.entity';
import { Order } from './orders/entities/order.entity';

dotenv.config();

const rawDataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Products, Address, Cart, CartItem, OrderItem, OrderTracking, Order],
  migrations: ['dist/migrations/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  logging: true,
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
