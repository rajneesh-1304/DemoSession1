import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { Products } from './products/product.entity';
import { Address } from './address/address.entity';
import { ProductModule } from './products/product.module';
import { AddressModule } from './address/address.module';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cartitem.entity';
import { CartModule } from './cart/cart.module';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderTracking } from './orders/entities/order-tracking.entity';
import { Order } from './orders/entities/order.entity';
import { OrderModule } from './orders/order.module';
@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'NestJS Todo Backend is running!' };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'DemoSession',
      entities: [
        User, Products, Address, Cart, CartItem, OrderItem, OrderTracking, Order
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    UserModule, ProductModule, AddressModule, CartModule, OrderModule
  ],
  controllers: [AppController],
})
export class AppModule {}