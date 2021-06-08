const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const mysql = require('mysql');
const CryptoJS = require("crypto-js");

const path = require('path');

const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res) {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.json('404', {
            'ERROR 404': 'La pagina que esta buscanda no existe o se pudo encontrar',
            'ESTADO': 'TuT'
        });
        return;
    }

});


//IO = esta es la comunicación del backend
module.exports.io = socketIO(server);
require('./sockets/sockets');

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});