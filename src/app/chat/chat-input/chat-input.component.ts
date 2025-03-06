import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { IMessage } from '../../../core/types';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  messageText: string = '';
  userName: string = localStorage.getItem('userName') || '';
  hasName: boolean = !!localStorage.getItem('userName');

  private authSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.hasName$.subscribe({
      next: (newHasName) => {
        this.hasName = newHasName;

        // take the name from local storage is the name was already present in the other tab
        if (newHasName) {
          this.userName = localStorage.getItem('userName') || '';
        }
      },
    });
  }

  sendMessage() {
    if (!this.authService.hasName) {
      alert('Please enter your name first.');

      return;
    }

    if (this.messageText.trim()) {
      const message: IMessage = {
        author: this.userName,
        text: this.messageText.trim(),
        createdAt: new Date(),
      };

      this.chatService.addMessage(message);
      this.messageText = '';
    }
  }

  onNameEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.confirmUserName();
    }
  }

  onMessageEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.hasName) {
      this.sendMessage();
    }
  }

  confirmUserName(): void {
    if (this.userName.trim()) {
      localStorage.setItem('userName', this.userName);

      this.authService.hasName = true;
    } else {
      alert('Please enter a valid name.');
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
