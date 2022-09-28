import { Router } from "express";
import HttpException from "../utils/httpException";
import { ParcelController } from "../controllers/parcel";

const router = Router();

router.get('/', (req, res) => {
    const parcelcontroller = new ParcelController();

    parcelcontroller.getParcels()
        .then((parcels) => {
            res.send(parcels);
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get parcels"))
})

router.get('/export', (req, res) => {
    const { format } = req.query
    const parcelcontroller = new ParcelController();

    parcelcontroller.exportParcels()
        .then((csv) => {
            res.header('Content-Type', 'text/csv');
            res.attachment('ParcelsAndRemuneration.csv');
            return res.send(csv);
    })
})

router.get('/remuneration', (req, res) => {
    const parcelcontroller = new ParcelController();

    parcelcontroller.getRemuneration()
        .then((response) => {
            res.send(response);
        })

})

router.get('/:id', (req, res) => {
    const parcelId = req.params.id;

    const parcelcontroller = new ParcelController();

    parcelcontroller.getParcelsByOrderId(parcelId)
        .then((parcels) => {
            if (!parcels.length) {
                throw new HttpException(404, "Parcels not found");
            }
            res.send(parcels);
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get parcels"))
})

router.post('/', (req, res) => {
    const parcelcontroller = new ParcelController();
    parcelcontroller.processOrders()
        .then((parcels) => {
            res.send(parcels)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not process order"))
})

router.post('/:id', (req, res) => {
    const orderId = req.params.id;
    const parcelcontroller = new ParcelController();
    parcelcontroller.processOrder(orderId)
        .then((parcels) => {
            res.send(parcels)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not process order"))
})

router.delete('/', (req, res) => {
    const parcelcontroller = new ParcelController();

    parcelcontroller.deleteAllParcels()
        .then((parcels) => {
            res.send(parcels)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not delete parcels"))
})

export { router as parcelRouter };