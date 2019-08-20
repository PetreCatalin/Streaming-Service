import UsersMap from './usersMap';
import User from './user';
import ElementRenderer from './ElementRenderer';
import base64js from 'base64-js';

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
    //console.warn('user connected');
    var currentSocketUser = new User(); //we need a way to store the current user
    var renderer;
    var cipher;
    socket.leave(socket.id); //leave it's own room so it won't broadcast video to itself

    socket.on('disconnect', () => {
        //console.warn('user disconnected');
        usersMap.delete(currentSocketUser.id); //delete from the map the user that logout
        socket.leaveAll();

        //de emis un eveniment de deconectare catre ceilalti utilizatori(cu io) si de afisat un mesaj corespunzator pentru cazul in care un user era subscris la stream-ul lui
        io.emit('userDisconnected', currentSocketUser);
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
        renderer = new ElementRenderer({ width: 300, height: 175 }); //size of the preview canvas (look in video component lines 24,25) and in css
        cipher = renderer.cipher;
    });

    socket.on('sendDataToBeEncrypted', (base64Encrypted) => {
        let rgbPixels = base64js.toByteArray(base64Encrypted);
        let arraySize = renderer.width * renderer.height * 3; //200*100*3 we need to create a new array of type Uint8ClampedArray
        var rgbPixelsClampedArray = new Uint8ClampedArray(arraySize); //we need to create a new array of type Uint8ClampedArray
        for (let i = 0; i< arraySize; ++i)
            rgbPixelsClampedArray[i] = rgbPixels[i];
        console.time('Encryption Time: ');
        var rgbEncrypted = cipher.encrypt(rgbPixelsClampedArray); //obtinem cele 60000 de valori ale pixelilor criptate
        console.timeEnd('Encryption Time: ');
        //console.log(rgbEncrypted);
        //console.log('encrypted done');
        console.time('Decryption Time: ');
        var rgbDecrypted = cipher.decrypt(rgbEncrypted);
        //console.log(rgbDecrypted);
        //console.log('decryption done');

        let base64Decrypted = base64js.fromByteArray(rgbDecrypted);
        //here we send data only to this socket's room (room with name socketId) --send data only to it's subscribers (need not to send data to itself)
        io.to(socket.id).emit('sendDecryptedDataToClient', base64Decrypted);  //rgbDecrypted este trimis catre client si pus in canvas preview ca rgbaDecrypted
        console.timeEnd('Decryption Time: ');
    });

    socket.on('stream', (streamBase64) => { //streamul trimis catre ceilalti utilizatori
        console.log('stream', streamBase64);
    });

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        //console.log(currentSocketUser.name, 'joined room ', roomName);
        socket.room = roomName;
    });

    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName);
        //console.log(currentSocketUser.name, 'left room ', roomName);
        socket.room = '';
    });

});

