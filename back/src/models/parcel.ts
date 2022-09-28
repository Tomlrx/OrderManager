import { Document, Schema, model, Types, Model } from "mongoose";
import { ItemList } from "./interface";

interface IParcel {
    orderId: string;
    items: ItemList[];
    weight: number;
    trackingId: string;
    paletteNumber: number
}

interface ParcelDoc extends Document<Types.ObjectId, any, IParcel> {
    orderId: string;
    items: ItemList[];
    weight: number;
    trackingId: string;
    paletteNumber: number
}

type ParcelModel = Model<ParcelDoc>

const parcelSchema = new Schema<IParcel, any, ParcelModel>({
    orderId: {
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
    weight: {
        type: Number,
        required: true
    },
    trackingId: {
        type: String,
        required: true
    },
    paletteNumber: {
        type: Number,
        required: true
    }
})

const Parcel = model<ParcelDoc, ParcelModel>('Parcel', parcelSchema);

export { Parcel, IParcel, ParcelDoc };