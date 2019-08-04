import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'Streaming Service';
  private socket: any;
  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {
    this.socket.on('hello', (data) => {  //listen to an event from server
      //console.log('data from server', data);
    }); 
  }
}
