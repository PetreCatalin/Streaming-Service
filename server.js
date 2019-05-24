const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.get('/', (req, res) => res.send('Hello World')); //send this to browser

const server = http.Server(app);
server.listen(3000); //start the server with node server.js

const io = socketIo(server); //instance of socket.io

io.on('connection', (socket) => {
    console.warn('new user connected');
    socket.on('disconnect', () => {
        console.warn('user disconnected');
    });
    socket.emit('hello', {  //emit events to the client
        greeting: 'Hello Catalin'
    }); 
});