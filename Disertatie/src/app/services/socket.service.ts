import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket = socketIo('http://localhost:3000'); //port of node server
  constructor() { }

  public getSocket(): any {
    return this.socket;
  }
}
