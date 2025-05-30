import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  sendMessage(message: string) {
    this.socket.emit('chat message', message);
  }

  getMessages(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('chat message', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}