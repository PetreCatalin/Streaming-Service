import { Injectable } from '@angular/core';
import { User } from '../core/user';

@Injectable()
export class UserService {
  private users = new Map<string, User>(); //user id si user

  constructor() {}

  public deleteUser(id:string) {
    this.users.delete(id);
  }

  public getAllUsers() {
    return this.users;
  }

  public createUserFromSocket(name: string, socket: any) {
    let newUser = new User(name,socket);
    this.users.set(newUser.id, newUser);
  }

  public deleteAllUsers() {
    this.users.clear();
  }

  public getMapValues() { //just the Users, without the ids
    return this.users.values();
  }

}
