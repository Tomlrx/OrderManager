import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    Delete,
} from "tsoa";
import { IOrder } from "../models/order";
import { orderService } from "../services/order";

@Route('order')
export class OrderController extends Controller {
    @Get('')
    public getOrders(): Promise<IOrder[]> {
        return orderService.getAllOrders();
    }

    @Get('{id}')
    public getOrder(
        @Path() id: string
    ): Promise<IOrder> {
        return orderService.getOrderById(id);
    }

    @Post('')
    public createOrder(
        @Body() order: IOrder
    ): Promise<IOrder> {
        return orderService.addOrder(order);
    }

    @Post('multiple')
    public createOrders(
        @Body() order: IOrder[]
    ): Promise<IOrder[]> {
        return orderService.addOrders(order);
    }

    @Delete('')
    public deleteAllOrders(): Promise<any> {
        return orderService.removeAllOrders();
    }
}