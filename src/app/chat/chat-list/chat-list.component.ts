import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { IMessage } from '../../../core/types';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf],
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent {
  messages: IMessage[] = [];
  hasName: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const authSubscription = this.authService.hasName$.subscribe(
      (newHasName) => {
        this.hasName = newHasName;
      }
    );
    this.subscriptions.push(authSubscription);

    const chatSubscription = this.chatService.messages$.subscribe(
      (newMessages) => {
        this.messages = newMessages;
      }
    );
    this.subscriptions.push(chatSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
