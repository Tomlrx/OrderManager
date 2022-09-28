import { FilterQuery, UpdateQuery } from "mongoose";
import HttpException from "../utils/httpException";
import { ItemListWeight } from "../models/interface";
import { IOrder, Order } from "../models/order";
import { itemService } from "./items";

export const orderService = {
    addOrder: (order: Omit<IOrder, "done">): Promise<IOrder> => Order.findOne({ id: order.id })
        .then((existing) => {
            if (existing) {
                throw new HttpException(409, "Order already exist");
            }

            return new Order(order).save()
        }),

    addOrders: (orders: Omit<IOrder, "done">[]): Promise<IOrder[]> => Promise.all(orders.map((order) => {
        return Order.findOne({ id: order.id })
            .then((existing) => {
                if (existing) {
                    return existing;
                }
                return new Order(order).save();
            })
    })),

    removeAllOrders: (): Promise<any> => Order.remove().then((result) => result),

    updateOrder: (filter: FilterQuery<IOrder>, update: UpdateQuery<IOrder>) => Order.findOneAndUpdate(filter, update, { new: true}).then((toto) => toto),

    getAllOrders: (): Promise<IOrder[]> => Order.find({}).then((orders) => orders),

    getAllNotDoneOrders: (): Promise<IOrder[]> => Order.find({ done: false }).then((orders) => orders),

    getAllDoneOrders: (): Promise<IOrder[]> => Order.find({ done: true }).then((orders) => orders),

    getOrderById: (id: string): Promise<IOrder> => Order.findOne({ id }).then((order) => {
        if (!order) {
            throw new HttpException(404, "Order not found");
        }
        return order;
    }),

    sortOrderItemsByWeight: (order: IOrder): Promise<ItemListWeight[]> => {
        
        const items = order.items.map((orderItem) => {
            return itemService.getItemById(orderItem.id)
                .then((item) => {
                    return { id: orderItem.id, quantity: orderItem.quantity, weight: item.weight };
                })
        })
        return Promise.all(items)
            .then((items) => {
                return items.sort((a, b) => {
                    return a.weight < b.weight ? 1 : -1;
                })
            })
    }
}