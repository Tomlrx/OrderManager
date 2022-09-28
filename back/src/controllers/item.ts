import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
} from "tsoa";
import { IItem } from "../models/item";
import { itemService } from "../services/items";

@Route('item')
export class ItemController extends Controller {
    @Get('')
    public getItems(): Promise<IItem[]> {
        return itemService.getAllItems();
    }

    @Get('{id}')
    public getItem(
        @Path() id: string
    ): Promise<IItem> {
        return itemService.getItemById(id);
    }

    @Post('')
    public createItem(
        @Body() item: IItem
    ): Promise<IItem> {
        return itemService.addItem(item);
    }

    @Post('multiple')
    public createItems(
        @Body() item: IItem[]
    ): Promise<IItem[]> {
        return itemService.addItems(item);
    }
}