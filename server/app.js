const express = require('express')
const app = express()
const port = process.env.PORT || 3030;

const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);

const _ = require('lodash');

var last10 = []

app.get('/calculate', (req, res) => {
    res.send('New Calculation');
    const connTS = new Date();

    last10.push(connTS.toLocaleString());
    last10 = _.drop(last10, [n=last10.length-10]);

    io.broadcast.emit('history_update', {
        history: last10,
        new: connTS.toLocaleString()
    });
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new_operation', (newOp) => {
        console.log('new_operation', newOp);

        newOp_str = `${newOp.x} ${newOp.op} ${newOp.y} = ${newOp.result}`;

        last10.push(newOp_str);
        last10 = _.drop(last10, [n=last10.length-10]);

        io.emit('history_update', {
            history: last10,
            new: newOp_str,
            result: newOp.result
        });
    });

    socket.emit('history_update', {
        history: last10
    });
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})