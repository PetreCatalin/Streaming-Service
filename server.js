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
    console.warn('user connected');
    var currentSocketUser = new User(); //we need a way to store the current user

    socket.on('disconnect', () => {
        console.warn('user disconnected');
        usersMap.delete(currentSocketUser.id); //delete from the map the user that logout
    });

    socket.on('newUser', (newUser) => { //also send the uuid from client
        currentSocketUser = new User(newUser.name, newUser.uuid, socket.id);
        usersMap.add(currentSocketUser);
    });

    socket.on('getUsers', (fn) => { //here fn is a whole function send as parameter --> this one (users:any) => {console.warn('users', users);}
        fn(usersMap);
    });

});

