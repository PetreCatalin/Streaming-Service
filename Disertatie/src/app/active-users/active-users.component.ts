import { Component, OnInit } from '@angular/core';
import { User } from '../core/user';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  private users: User[] = [];
  private socket:any;
  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {
    setInterval(() => { //refresh the list of users coming from server
      this.socket.emit('getUsers', (users:any) => {
        this.users = users;
        console.warn('users', this.users); //user.socketId is the id of socket created on server for the current user
      });
    }, 500);
  }

}
