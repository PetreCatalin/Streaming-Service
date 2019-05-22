import { Component, OnInit } from '@angular/core';
import { User } from '../core/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  private users: User[];
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
