import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/order.module';

@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'NestJS Backend is running!' };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true, 
    }),

    UserModule,
    ProductModule,
    AddressModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
