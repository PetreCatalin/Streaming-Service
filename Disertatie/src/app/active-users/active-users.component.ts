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
  private hoveredUserName: string; //need to get those from the server
  private hoveredUserId: any;
  @Output() userSelected: EventEmitter<string> = new EventEmitter();

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {
    this.socket.emit('getCurrentUser', (currentUser: any) => {
      this.currentUser = currentUser;
      console.warn('current User', currentUser);  //currentUser.socketId 
    });

    setInterval(() => { //refresh the list of users coming from server at every 500 miliseconds
      this.socket.emit('getUsers', (users:any[]) => { //here users is usersMap from server
        if (this.allUsers.toString() !== users.toString()) { //refresh users array only if new users are coming or users are leaving
          //this keeps the green hover on selected user until it refreshes
          this.allUsers = users;
          this.users = users.filter(user => user.name !== this.currentUser.name); //don't add current user name in other users list

          //here hover again the user that i received stream from because at user refresh hover is lost
          if (this.socket.currentUserHovered) {
            setTimeout(() => {
            let correspondingH3 = (<HTMLDivElement>document.getElementById(this.socket.currentUserHovered));
            if (correspondingH3)
              correspondingH3.style.backgroundColor = '#8BFC02'; //mark div with green so it receive broadcast stream from that user
            }, 100); //leave this so the users list has time to refresh
          }
        }
      });
    }, 500);
  }

  private hoverUser(userName: string, userId: string, socketId: any) { 
    //make all divs white (clear previous green div/ selected user)
    let userDivs = document.getElementsByClassName('userNames') as HTMLCollectionOf<HTMLDivElement>;;
    for (let i=0;i<userDivs.length; ++i) {
      userDivs[i].style.backgroundColor = 'white';
    }
    let correspondingH3 = (<HTMLDivElement>document.getElementById(userName));
    correspondingH3.style.backgroundColor = '#8BFC02'; //mark div with green so it receive broadcast stream from that user

    this.userSelected.emit(userName); //emit to the parent component (video)
    //change the broadcastingMessage string from video component to 'You are currently watching a video streamed by ' + userName

    if (this.socket.room)
      this.socket.emit('leaveRoom', this.socket.room); //leave the previous room if one existed
    this.socket.emit('joinRoom', socketId); //can connect to a room only in server, maybe use graph instead of rooms ??
    this.socket.room = socketId;
    this.socket.currentUserHovered = userName; //keep this so that I can hover again after one user connect/disconnect

    //here we need to request stream from the selected user
    this.socketService.requestStream(userId);
  }
}
