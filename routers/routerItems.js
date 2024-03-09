const express = require('express');
const database = require('../database');
const e = require('express');

const routerItems = express.Router();

routerItems.get('/', async (req, res) => {
    database.connect()

    let items = []

    if (req.query.p != undefined && !isNaN(req.query.p)) {
        let page = parseInt(req.query.p)
        let eP = 2
        items = await database.query('SELECT * FROM items OFFSET ? ROWS FETCH NEXT ? ROWS ONLY', [(page * eP) - eP, eP])

    } else {
        items = await database.query('SELECT * FROM items')
    }
    
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