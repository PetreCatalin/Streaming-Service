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
  private currentUser: User;

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {
    this.socket.emit('getCurrentUser', (currentUser: any) => {
      this.currentUser = currentUser;
      console.warn('current User', currentUser);
    })

    setInterval(() => { //refresh the list of users coming from server
      this.socket.emit('getUsers', (users:any[]) => {
        this.users = users.filter(user => user.name !== this.currentUser.name); //don't add current user name in other users list
        console.warn('other users', this.users); //user.socketId is the id of socket created on server for the current user
      });
    }, 500);
  }

}
