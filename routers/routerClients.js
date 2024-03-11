const express = require('express');
const database = require('../database');

const routerClients = express.Router();

routerClients.delete('/:DNI', async (req, res) => {
    let DNIClient = req.params.DNI
    if (DNIClient == undefined) {
        return res.status(400).json({error: 'no id params'})
    }

    database.connect()

    try {
        let ordersOfClients = await database.query('SELECT id FROM orders WHERE DNIClient = ?', [DNIClient])

        if (ordersOfClients.length > 0) {
            ordersOfClients = ordersOfClients.map(order => order.id)
            await database.query('DELETE FROM orders_items WHERE idOrder IN (?)', [ordersOfClients])
            await database.query('DELETE FROM orders WHERE DNIClient = ?', [DNIClient])
        }

        await database.query('DELETE FROM clients WHERE DNI = ?', [DNIClient])

    } catch (error) {
        return res.status(400).json({error: 'error borrando el usuario'})
    }

    database.disConnect()

    res.json({deleted: true})
});

module.exports = routerClients;