const express = require('express');
const database = require('../database');

const routerItems = express.Router();

routerItems.get('/', async (req, res) => {
    database.connect()
    const items = await database.query('SELECT * FROM items')
    database.disConnect()
    res.json(items)
});

routerItems.get('/:id', async (req, res) => {
    if (req.params.id == undefined) {
        return res.status(400).json({error: 'no id param'})
    }
    database.connect()
    const items = await database.query('SELECT * FROM items WHERE id = ?', [req.params.id])
    database.disConnect()
    res.json(items)
});

module.exports = routerItems;