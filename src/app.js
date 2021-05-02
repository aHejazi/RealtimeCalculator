const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);

const _ = require('lodash');

var last10 = []

io.on('connection', (socket) => {
    // console.log('a user connected');

    socket.on('new_operation', (newOp) => {
        // console.log('new_operation', newOp);

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

// if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
// }

server.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})