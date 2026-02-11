import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Query('userId') userId: string) {
    return this.cartService.getCart(+userId);
  }

  @Post('add')
  addToCart(
    @Body() cartData
  ) {
    return this.cartService.addToCart(cartData
    );
  }

  @Patch('update/:itemId')
  updateQuantity(
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: string,
  ) {
    return this.cartService.updateQuantity(+itemId, +quantity);
  }

  @Delete('remove/:itemId')
  removeItem(@Param('itemId') itemId: number) {
    return this.cartService.removeItem(itemId);
  }

  @Delete('clear')
  clearCart(@Query('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
