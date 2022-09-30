# Order Manager

## Start

`docker-compose up`

## Initialisation

In folder back/test-data there is 2 json files

- Copy the content of items.json and send it in the body to [POST] http://localhost:3000/item/multiple
- Copy the content of orders.json and send it in the body to [POST] http://localhost:3000/order/multiple

## Process order

- You can process order by orderId: [POST] http://localhost:3000/parcel/{orderId}
- You can process all undone order: [POST] http://localhost:3000/parcel

Processed orders will be marked as done and can not be processed a second time

You can delete all order and parcel:
 - [DELETE] http://localhost:3000/order
 - [DELETE] http://localhost:3000/parcel

## Export

[GET] http://localhost:3000/parcel/remuneration will return:
 - array of parcels
 - array of remuneration by weight range
 - total remuneration

[GET] http://localhost:3000/parcel/export witll return a ParcelsAndRemuneration.csv with remuneration by weight range and the total.