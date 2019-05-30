import UsersMap from './usersMap';
import User from './user';

//https://timonweb.com/posts/how-to-enable-es6-imports-in-nodejs/

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.get('/', (req, res) => res.send('Hello World')); //send this to browser
const server = http.Server(app);
server.listen(3000); //start the server with node server.js
const io = socketIo(server); //instance of socket.io

var usersMap = new UsersMap();

io.on('connection', (socket) => {
    console.warn('new user connected');
    var currentSocketUser;
    socket.on('disconnect', () => {
        console.warn('user disconnected');
    });

    socket.on('newUser', (newUser) => { //also send the uuid from client
        console.warn(newUser.name);
        console.warn(newUser.uuid);
        var user = new User(newUser.name, newUser.uuid, socket);
        currentSocketUser = user;
        usersMap.add(user);
    });

    socket.on('getUsers', (fn) => { //here fn is a whole function send as parameter --> this one (users:any) => {console.warn('users', users);}
        console.warn('ia userii');
        fn(usersMap);
    });

});

