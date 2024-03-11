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
    await database.query('DELETE FROM clients WHERE DNI = ?', [DNIClient])
    } catch (error) {
        return res.status(400).json({error: 'error borrando el usuario'})
    }

    database.disConnect()

    res.json({deleted: true})
});

module.exports = routerClients;