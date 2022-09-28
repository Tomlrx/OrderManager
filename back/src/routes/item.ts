import { Router } from "express";
import { ItemController } from "../controllers/item";

const router = Router();

router.get('/', (req, res) => {
    const itemController = new ItemController();

    itemController.getItems()
        .then((items) => {
            res.send(items)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get items"))
})

router.get('/:id', (req, res, next) => {
    const itemId = req.params.id;
    const itemController = new ItemController();

    itemController.getItem(itemId)
        .then((item) => {
            res.send(item)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not get items"))
})

router.post('/', (req, res) => {
    const item = req.body;
    if (!item) res.status(400).send("Missing item information");
    const itemController = new ItemController();

    itemController.createItem(item)
        .then((newItem) => {
            res.send(newItem)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not create item"))
})

router.post('/multiple', (req, res) => {
    const items = req.body;
    if (!items) res.status(500).send("Missing item information");
    const itemController = new ItemController();

    itemController.createItems(items)
        .then((newItems) => {
            res.send(newItems)
        })
        .catch((err) => res.status(err.status || 500).send(err.message || "Could not create item"))
})

export { router as itemRouter };