import {
    Controller,
    Get,
    Path,
    Post,
    Route,
    Delete,
} from "tsoa";
import { IParcel } from "../models/parcel";
import { orderService } from "../services/order";
import { parcelService } from "../services/parcel";
import { defaultExportFields, downloadResource } from "../utils/csv";
import { getTotalByWeight, RemunrationObject } from "../utils/remuneration";

interface GetRemuneratioResponse {
    parcels: IParcel[];
    remunerationByWeight: RemunrationObject[];
    totalRenumeration: RemunrationObject;
}

@Route('parcel')
export class ParcelController extends Controller {
    @Get('')
    public getParcels(): Promise<IParcel[]> {
        return parcelService.getAllParcels();
    }

    @Delete('')
    public deleteAllParcels() {
        return parcelService.removeAllParcel();
    }

    @Get('export')
    public exportParcels(): Promise<string> {
        return parcelService.getAllParcels()
            .then((parcels) => {
                const remunerationByWeight = getTotalByWeight(parcels)
                const totalRenumeration = remunerationByWeight.reduce((total, remuneration) => {
                    total.number += remuneration.number;
                    total.remuneration += remuneration.remuneration;
                    return total;
                }, {
                    range: 'all',
                    number: 0,
                    remuneration: 0
                })

                return downloadResource('ParcelsAndRemuneration.csv', defaultExportFields, [...remunerationByWeight, totalRenumeration]);
            })
    }

    @Get('remuneration')
    public getRemuneration(): Promise<GetRemuneratioResponse> {
        return parcelService.getAllParcels()
            .then((parcels) => {
                const remunerationByWeight = getTotalByWeight(parcels)
                const totalRenumeration = remunerationByWeight.reduce((total, remuneration) => {
                    total.number += remuneration.number;
                    total.remuneration += remuneration.remuneration;
                    return total;
                }, {
                    range: 'all',
                    number: 0,
                    remuneration: 0
                })

                return {
                    parcels,
                    remunerationByWeight,
                    totalRenumeration
                }
            })
    }

    @Get('{orderId}')
    public getParcelsByOrderId(
        @Path() orderId: string
    ): Promise<IParcel[]> {
        return parcelService.getParcelsByOrderId(orderId)
    }

    @Post('')
    public processOrders(): Promise<IParcel[]> {
        return orderService.getAllNotDoneOrders()
            .then((orders) => {
                return parcelService.processOrders(orders)
            })

    }

    @Post('{orderId}')
    public processOrder(
        @Path() orderId: string
    ): Promise<IParcel[]> {
        return orderService.getOrderById(orderId)
            .then((order) => {
                return parcelService.processOrder(order)
            })

    }
}