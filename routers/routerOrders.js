const express = require('express');
const database = require('../database');

const routerOrders = express.Router();

routerOrders.get('/', async (req, res) => {
    database.connect()

    let orders = []

    if (req.query.DNIClient != undefined) {
        orders = await database.query('SELECT * FROM orders WHERE DNIClient = ? ', [req.query.DNIClient])
    } else {
        orders = await database.query('SELECT * FROM orders')
    }
    
    database.disConnect()
    res.json(orders)
});

routerOrders.get('/:id', async (req, res) => {
    if (req.params.id == undefined) {
        return res.status(400).json({error: 'no id param'})
    }
    database.connect()
    const orders = await database.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    database.disConnect()
    res.json(orders)
});

routerOrders.post('/', async (req, res) => {
    let DNIClient = req.body.DNIClient
    if (DNIClient == undefined) {
        return res.status(400).json({error: 'no DNIClient in body'})
    }
    database.connect()
    let insertedOrder = await database.query('INSERT INTO orders (DNIClient, state) VALUES (?, 0)',
        [DNIClient])
    database.disConnect()
    res.json({inserted: insertedOrder})
});

routerOrders.post('/:idOrder/items', async (req, res) => {
    let idOrder = req.params.idOrder
    if (idOrder == undefined) {
        return res.status(400).json({error: 'no idOrder'})
    }
    let idItem = req.body.idItem
    if (idItem == undefined) {
        return res.status(400).json({error: 'no idItem in body'})
    }
    let units = req.body.units
    if (units == undefined) {
        return res.status(400).json({error: 'no units in body'})
    }
    units = parseInt(units)

    database.connect()
    let itemsInOrder = await database.query('SELECT * FROM orders_items WHERE idOrder = ? AND idItem = ?', [idOrder, idItem])
    if (itemsInOrder.length > 0) {
        return res.status(400).json({error: 'item alredy exists '})
    }

    await database.query('INSERT INTO orders_items (idOrder, idItem, units) VALUES (?, ?, ?)', [idOrder, idItem, units])
    database.disConnect()
    res.json({inserted: true})
});

routerOrders.put('/:idOrder/items/:idItem', async (req, res) => {
    let idOrder = req.params.idOrder
    if (idOrder == undefined) {
        return res.status(400).json({error: 'no idOrder in params'})
    }

    let idItem = req.params.idItem
    if (idItem == undefined) {
        return res.status(400).json({error: 'no idItem in params'})
    }

    let units = req.body.units
    if (units == undefined) {
        return res.status(400).json({error: 'no units in body'})
    }

    database.connect()

    await database.query('UPDATE orders_items SET units = ? WHERE idOrder = ? AND idItem = ?', [units, idOrder, idItem])

    database.disConnect()

    res.json({modified: true})
});

routerOrders.put('/orders/:id', async (req, res) => {
    let idOrder = req.params.id
    if (idOrder == undefined) {
        return res.status(400).json({error: 'no idOrder in params'})
    }

    let state = req.body.state
    if (state == undefined) {
        return res.status(400).json({error: 'no state in params'})
    }
    // state = parseInt(state)

    database.connect()

    await database.query('UPDATE orders SET state = ? WHERE id = ?', [state, idOrder])

    database.disConnect()
    res.json({modified: true})
});

module.exports = routerOrders;