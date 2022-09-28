import { Parser } from 'json2csv';
import { RemunrationObject } from './remuneration';

export interface CsvFields {
    label: string;
    value: string;
}

export const defaultExportFields = [
    {
        label: 'Range',
        value: 'range'
    },
    {
        label: 'Number',
        value: 'number'
    },
    {
        label: 'Remuneration',
        value: 'remuneration'
    }
]

export const downloadResource = (fileName: string, fields: any, data: RemunrationObject[]) => {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    return csv
}
