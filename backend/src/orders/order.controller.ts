import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(@Body('userId') userId: number) {
    return this.orderService.checkout(userId);
  }

  @Get()
  getUserOrders(@Query('userId') userId: number) {
    return this.orderService.getUserOrders(userId);
  }

  @Get('order')
  getOrders(){
    return this.orderService.getOrders();
  }


  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('order/:id')
  getOrderBySellerId(@Param('id') id :string){
    return this.orderService.getOrderBySellerId(+id);
  }
}
