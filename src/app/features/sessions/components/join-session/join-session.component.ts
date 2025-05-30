import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html'
})
export class JoinSessionComponent implements OnInit, OnDestroy {
  message = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getMessages().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  send() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}