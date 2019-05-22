import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {
    this.loadEnterBinding();
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
        console.warn(nameInput.value);

        if (nameInput.value.length>=3) {
          //add to service
          this.userService.createUserFromSocket(nameInput.value, 0); //replace 0 with the socket
          
          this.router.navigate(['/video']);
        }
      }
    }
  }

}
