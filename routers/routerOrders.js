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

module.exports = routerOrders;