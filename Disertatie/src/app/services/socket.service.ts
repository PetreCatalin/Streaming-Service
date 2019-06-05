import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket = socketIo('http://localhost:3000'); //port of node server
  constructor() { }

  public getSocket(): any {
    return this.socket;
  }

  public onStreamReceived(callback: any): any { //cand primeste streamul
    return this.socket.on('stream', callback);
  }

  public requestStream(userId: string): any { //face un request pentru a primi stream-ul (se executa cand selectezi un user din lista)
    return this.socket.emit('user_stream', userId);
  }

  public sendStream(data: any): any {
    return this.socket.emit('stream', data); //emite streamul catre ceilalti utilizatori
  }
}
