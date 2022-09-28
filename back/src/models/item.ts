import { Document, Schema, model, Types, Model } from "mongoose";

interface IItem {
    id: string;
    name: string;
    weight: number;
}

interface ItemDoc extends Document<Types.ObjectId, any, IItem> {
    id: string;
    name: string;
    weight: number;
}

type ItemModel = Model<ItemDoc>


const itemSchema = new Schema<IItem, any, ItemModel>({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
})

const Item = model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item, IItem, ItemDoc };