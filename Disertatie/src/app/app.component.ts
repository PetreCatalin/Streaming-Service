import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Disertatie';

  ngOnInit() {
    const socket = socketIo('http://localhost:3000'); //port of node server

    socket.on('hello', (data) => {  //listen to an event from server
      console.log('data from server', data);
    }) 
  }
}
