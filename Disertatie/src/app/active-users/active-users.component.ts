import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  private allUsers: User[] = [];
  @Output() userSelected: EventEmitter<string> =   new EventEmitter();

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {
    this.socket.emit('getCurrentUser', (currentUser: any) => {
      this.currentUser = currentUser;
      console.warn('current User', currentUser);
    });

    setInterval(() => { //refresh the list of users coming from server
      this.socket.emit('getUsers', (users:any[]) => {
        if (this.allUsers.toString() !== users.toString()) { //refresh users array only if new users are coming or users are leaving
          //this keeps the green hover on selected user until it refreshes
          this.allUsers = users;
          this.users = users.filter(user => user.name !== this.currentUser.name); //don't add current user name in other users list
          console.warn('other users', this.users); //user.socketId is the id of socket created on server for the current user

          //here hover again the user that i received stream from because at user refresh hover is lost
        }
      });
    }, 500);
  }

  private hoverUser(userName: string) { 
    //make all divs white (clear previous green div/ selected user)
    let userDivs = document.getElementsByClassName('userNames') as HTMLCollectionOf<HTMLDivElement>;;
    for (let i=0;i<userDivs.length; ++i) {
      userDivs[i].style.backgroundColor = 'white';
    }
    let correspondingH3 = (<HTMLDivElement>document.getElementById(userName));
    correspondingH3.style.backgroundColor = '#8BFC02'; //mark div with green so it receive broadcast stream from that user

    this.userSelected.emit(userName); //emit to the parent component (video)
    //change the broadcastingMessage string from video component to 'You are currently watching a video streamed by ' + userName
  }
}
