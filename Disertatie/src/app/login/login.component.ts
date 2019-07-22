import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SocketService } from '../services/socket.service';
import { UUID } from "angular2-uuid";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private socket:any;

  constructor(private router: Router, private userService: UserService, private socketService: SocketService) {
    this.loadEnterBinding();
    this.socket = this.socketService.getSocket();
  }

  ngOnInit() {  
    let nameInput = <HTMLInputElement>document.getElementById('nameInput');
    nameInput.value = 'User' + Math.floor(Math.random() * 9999);
  }

  private loadEnterBinding() {
    document.onkeydown = () => { 
      var e:any = window.event;
      if (e.keyCode === 13) { //pressed enter
        let nameInput = <HTMLInputElement>document.getElementById('nameInput');

        if (nameInput.value.length>=3) {
          this.socket.emit('newUser', {name: nameInput.value, uuid: UUID.UUID()});
          this.router.navigate(['/video']);
        }
      }
    }
  }

}
