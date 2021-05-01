const express = require('express')
const app = express()
const port = process.env.PORT || 3030;

const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);

app.get('/calculate', (req, res) => {

    res.send('New Calculation')
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('connection', "new conn");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})