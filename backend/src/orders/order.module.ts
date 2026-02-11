import { Module } from "@nestjs/common"; 
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderTracking } from "./entities/order-tracking.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Cart } from "../cart/entities/cart.entity";
import { CartItem } from "../cart/entities/cartitem.entity";
import { Products } from "../products/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderTracking, OrderItem, Cart, CartItem, Products])],
    controllers:[OrderController],
    providers:[OrderService],
})

export class OrderModule {}