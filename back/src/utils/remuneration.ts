import { IParcel } from "../models/parcel";

export interface RemunrationObject {
    range: string;
    number: number;
    remuneration: number;
}

export const getTotalByWeight = (parcels: IParcel[]) => {
    return parcels.reduce((remunerations: RemunrationObject[], parcel) => {
        if (parcel.weight < 1) {
            remunerations[0].number++;
            remunerations[0].remuneration += 1;
        } else if (parcel.weight < 5) {
            remunerations[1].number++;
            remunerations[1].remuneration += 2;
        } else if (parcel.weight < 10) {
            remunerations[2].number++;
            remunerations[2].remuneration += 3;
        } else if (parcel.weight < 20) {
            remunerations[3].number++;
            remunerations[3].remuneration += 5;
        } else {
            remunerations[4].number++;
            remunerations[4].remuneration += 10;
        }
        return remunerations;
    }, [
        {
            range: '0kg - 1kg',
            number: 0,
            remuneration: 0
        },
        {
            range: '1kg - 2kg',
            number: 0,
            remuneration: 0
        },
        {
            range: '5kg et 10kg',
            number: 0,
            remuneration: 0
        },
        {
            range: '10kg et 20kg',
            number: 0,
            remuneration: 0
        },
        {
            range: '20kg et 30kg',
            number: 0,
            remuneration: 0
        },
    ])
}
