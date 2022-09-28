import HttpException from "../utils/httpException";
import { IItem, Item } from "../models/item";

export const itemService = {
    addItem: (item: IItem): Promise<IItem> => Item.findOne({ id: item.id })
        .then((existing) => {
            if (existing) {
                throw new HttpException(409, "Item already exist")
            }
            return new Item(item).save()
        }),

    addItems: (items: IItem[]): Promise<IItem[]> => Promise.all(items.map((item) => {
        return Item.findOne({ id: item.id })
            .then((existing) => {
                if (existing) {
                    return existing
                }
                return new Item(item).save()
            })
    })),

    getAllItems: (): Promise<IItem[]> => Item.find({}).then((items: IItem[]) => items),

    getItemById: (id: string): Promise<IItem> => Item.findOne({ id }).then((item) => {
        if (!item) {
            throw new HttpException(404, "Item not found");
        }
        return item;
    })
}