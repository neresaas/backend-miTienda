const express = require('express');
const database = require('./database');
const routerItems = require('./routers/routerItems');

const app = express();
app.use('/items', routerItems);

const port = 3000;

app.listen(port, () => {
    console.log('App listening in port ' + port)
});