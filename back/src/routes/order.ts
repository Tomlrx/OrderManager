import { Router } from "express";
import { OrderController } from "../controllers/order";

const router = Router();

router.get('/', (req, res) => {
    const orderController = new OrderController();

    orderController.getOrders()
        .then((orders) => {
            res.send(orders)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get orders"))
})

router.get('/:id', (req, res, next) => {
    const orderId = req.params.id;
    const orderController = new OrderController();

    orderController.getOrder(orderId)
        .then((order) => {
            res.send(order)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get items"))
})


router.post('/', (req, res) => {
    const order = req.body;
    if (!order) res.status(400).send("Missing order information");
    const orderController = new OrderController();

    orderController.createOrder(order)
        .then((newOrder) => {
            res.send(newOrder)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not create order"))
})

router.post('/multiple', (req, res) => {
    const orders = req.body.orders;
    if (!orders) res.status(400).send("Missing order information");
    const orderController = new OrderController();

    orderController.createOrders(orders)
        .then((newOrders) => {
            res.send(newOrders)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not create orders"))
})

router.delete('/', (req, res) => {
    const orderController = new OrderController();

    orderController.deleteAllOrders()
        .then((orders) => {
            res.send(orders)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not delete parcels"))
})

export { router as orderRouter };