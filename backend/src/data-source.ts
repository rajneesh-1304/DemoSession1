import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Products } from './products/product.entity';
import { Address } from './address/address.entity';
import { CartItem } from './cart/entities/cartitem.entity';
import { Cart } from './cart/entities/cart.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderTracking } from './orders/entities/order-tracking.entity';
import { Order } from './orders/entities/order.entity';
const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'DemoSession',
  synchronize: false,
  entities: [
    User, Products, Address, Cart, CartItem, OrderItem, OrderTracking, Order
  ],
  seeds: ['dist/seeds/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  logging: true
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;