import express, { NextFunction, Request, Response } from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";

import { itemRouter } from './routes/item';
import { orderRouter } from './routes/order';
import { parcelRouter } from './routes/parcel';
import HttpException from './utils/httpException';

const app = express();
app.use(json());
app.use(express.static("public"));

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json"
        }
    })
)

app.use('/item', itemRouter);
app.use('/order', orderRouter);
app.use('/parcel', parcelRouter);

mongoose.connect("mongodb://wing-database/wing", {
    autoIndex: true,
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.error(err);
})

function errorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";

    res.status(status).send({ status, message });
}
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log('Server is listening on port 3000');
    
})