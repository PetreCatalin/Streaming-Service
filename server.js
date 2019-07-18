import UsersMap from './usersMap';
import User from './user';
import ElementRenderer from './ElementRenderer';
import { toRgbUint8ClampedArray } from './ArrayUtils';

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
    var renderer;
    var cipher;

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

    socket.on('getCurrentUser', (fn) => { //get the current user
        fn(currentSocketUser);
    });

    socket.on('createElementRenderer', (fn) => {
        renderer = new ElementRenderer({ width: 200, height: 100 }); //size of the preview canvas (look in video component lines 24,25) and in css
        //console.log(renderer.cipher);
        cipher = renderer.cipher;
    });

    socket.on('getEncryptedDataUrl', (videoPlayer) => {
        console.log('videoPlayer', videoPlayer);
    });

    socket.on('sendDataToBeEncrypted', (imgData) => {
        //console.log(imgData); ajunge bine
        var pixelsToBeEncrypted = toRgbUint8ClampedArray(imgData); //need to make this conversion on the server
        console.log(pixelsToBeEncrypted);
        var rgbEncrypted = cipher.encrypt(pixelsToBeEncrypted);
        console.log(rgbEncrypted.length); //asta trebuie trimis catre decriptare
        console.log('encrypted');
    });

    socket.on('stream', (streamBase64) => { //streamul trimis catre ceilalti utilizatori
        console.log('stream', streamBase64);
    })

});

