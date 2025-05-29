import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.SERVER_URL);
  }

  joinSession(sessionId: string, user: string) {
    this.socket.emit('joinSession', { sessionId, user });
  }

  sendMessage(sessionId: string, user: string, message: string) {
    this.socket.emit('sendMessage', { sessionId, user, message });
  }

  onReceiveMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (data) => observer.next(data));
    });
  }

  onChatHistory(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('chatHistory', (messages) => observer.next(messages));
    });
  }
}