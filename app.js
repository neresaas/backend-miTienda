const express = require('express');
const database = require('./database');

const routerItems = require('./routers/routerItems');
const routerOrders = require('./routers/routerOrders');
const routerClients = require('./routers/routerClients');

const app = express();

app.use(express.json());

app.use('/items', routerItems);
app.use('/orders', routerOrders);
app.use('/clients', routerClients);

const port = 3000;

app.listen(port, () => {
    console.log('App listening in port ' + port)
});