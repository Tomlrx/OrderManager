import axios from "axios";
import HttpException from "../utils/httpException";
import { ItemListWeight } from "../models/interface";
import { IOrder } from "../models/order";
import { IParcel, Parcel } from "../models/parcel";
import { orderService } from "./order";

type GetTrackingCodeResponse = string[];

const itemLoop = (newParcel: IParcel, items: ItemListWeight[]) => {
    let itemIndex = 0;
    while (itemIndex < items.length) {
        let { updatedNewParcel, updatedItems } = quantityLoop(newParcel, items, itemIndex);
        if (updatedItems[itemIndex].quantity === 0) {
            updatedItems.splice(itemIndex, 1)
        } else {
            itemIndex++;
        }
        newParcel = updatedNewParcel;
        items = updatedItems;
    }

    const updatedNewParcel = newParcel;
    const updatedItems = items

    return { updatedNewParcel, updatedItems };
}

const quantityLoop = (newParcel: IParcel, items: ItemListWeight[], itemIndex: number) => {
    let quantityIndex = 0;

    while (quantityIndex < items[itemIndex].quantity) {
        if (newParcel.weight + items[itemIndex].weight <= 30) {
            const index = newParcel.items.findIndex((value) => value.id === items[itemIndex].id);
            if (index >= 0) {
                newParcel.items[index].quantity++;
            } else {
                newParcel.items.push({ id: items[itemIndex].id, quantity: 1 })
            }
            newParcel.weight = (newParcel.weight * 100 + items[itemIndex].weight * 100) / 100;
            // Above multiplication and division allow me to avoid the float operation error ( exemple: 2.2 + 1.2 = 3.399999999997)
            items[itemIndex].quantity--;
        } else {
            quantityIndex++;
        }
    }
    const updatedNewParcel = newParcel
    const updatedItems = items
    return { updatedNewParcel, updatedItems };
}

const createTrackingCode = (): Promise<string> => {
    return axios.get<GetTrackingCodeResponse>("http://www.randomnumberapi.com/api/v1.0/randomstring?min=15&max=15&count=1")
        .then((response) => {
            if (response.data[0]) {
                return response.data[0];
            } else {
                throw new HttpException(404, "Tracking code not found");
            }
        })
}


export const parcelService = {
    getAllParcels: (): Promise<IParcel[]> => Parcel.find({}).then((parcels: IParcel[]) => parcels),

    getParcelsByOrderId: (orderId: string): Promise<IParcel[]> => Parcel.find({ orderId }).then((parcels: IParcel[]) => parcels),

    removeAllParcel: (): Promise<any> => Parcel.remove().then((result) => result),

    getPaletteNumbers: () => {
        return Parcel.find({})
            .then((parcels: IParcel[]) => {
                const number = parcels.length;
                const parcelPaletteNumber = number % 30;
                const paletteNumber = (number - parcelPaletteNumber) / 30 + 1;
                return { parcelPaletteNumber, paletteNumber };
            })
    },

    processOrder: async (order: IOrder) => {
        let { parcelPaletteNumber, paletteNumber } = await parcelService.getPaletteNumbers();
        
        let items = await orderService.sortOrderItemsByWeight(order)
        
        const newParcels: IParcel[] = []
        while (items.length) {
            let newParcel: IParcel = {
                orderId: order.id,
                items: [],
                weight: 0,
                trackingId: '',
                paletteNumber: paletteNumber
            }

            let { updatedNewParcel, updatedItems } = itemLoop(newParcel, items);
            items = updatedItems;
            newParcels.push(updatedNewParcel);
            parcelPaletteNumber++;
            if (parcelPaletteNumber === 30) {
                parcelPaletteNumber = 0;
                paletteNumber++;
            }
        }

        return Promise.resolve(newParcels)
            .then((parcels) => {
                return Promise.all(parcels.map((parcel) => {
                    return createTrackingCode()
                        .then((code) => {
                            parcel.trackingId = code;
                            return parcel;
                        })
                }))
            })


    },

    processOrders: (orders: IOrder[]): Promise<IParcel[]> => {
        return orders.reduce((parcelsPromise: Promise<IParcel[]>, order: IOrder) => {
            return parcelsPromise.then((parcels) => {
                return parcelService.processOrder(order)
                    .then((newParcels) => newParcels.map((parcel) => {
                        orderService.updateOrder({ id: order.id }, { done: true })
                        return new Parcel(parcel).save();
                    }))
                    .then((newParcels) => {
                        return Promise.all(newParcels);
                    })
                    .then((newParcels) => {
                        return [ ...parcels, ...newParcels ];
                    })
            })

        }, Promise.resolve([]) as Promise<IParcel[]>)
    }
}