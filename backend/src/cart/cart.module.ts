import { Module } from "@nestjs/common"; 
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cartitem.entity";
import { Products } from "../products/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, Products])],
    controllers:[CartController],
    providers:[CartService],
})

export class CartModule {}