import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../config/AppConfig';
import { IMessage } from '../../types';
import { BroadcastService } from '../broadcast/broadcast.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<IMessage[]>(
    this.loadMessages()
  );
  isBroadcasting = false;

  constructor(private broadcastService: BroadcastService<IMessage>) {
    this.broadcastService
      .getChannel(AppConfig.CHANNEL_NAMES.CHAT)
      .subscribe((message) => {
        // run the method only when it is not the tab that sent the message
        if (!this.isBroadcasting) {
          this.addMessage(message, false);
        }
      });
  }

  addMessage(message: IMessage, broadcast: boolean = true) {
    const updatedMessages = [...this.messagesSubject.value, message];

    this.messagesSubject.next(updatedMessages);
    this.saveMessages(updatedMessages);

    if (broadcast) {
      this.isBroadcasting = true;
      this.broadcastService.sendMessage(AppConfig.CHANNEL_NAMES.CHAT, message);
      this.isBroadcasting = false;
    }
  }

  private loadMessages(): IMessage[] {
    const messagesJson = localStorage.getItem('messages');

    return messagesJson ? JSON.parse(messagesJson) : [];
  }

  private saveMessages(messages: IMessage[]) {
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  get messages$() {
    return this.messagesSubject.asObservable();
  }
}
