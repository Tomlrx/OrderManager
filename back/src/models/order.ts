import { Document, Schema, model, Types, Model } from "mongoose";
import { ItemList } from "./interface";

interface IOrder {
    id: string;
    items: ItemList[];
    date: Date;
    done: boolean
}

interface OrderDoc extends Document<Types.ObjectId, any, IOrder> {
    id: string;
    items: ItemList[];
    date: Date;
    done: boolean;
}

type OrderModel = Model<OrderDoc>


const orderSchema = new Schema<IOrder, any, OrderModel>({
    id: {
        type: String,
        required: true
    },
    items: [
        {
            id: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ],
    date: {
        type: Date,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    }
})

const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, IOrder, OrderDoc };