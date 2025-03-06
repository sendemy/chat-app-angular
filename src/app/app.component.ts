import { Component } from '@angular/core';
import { ChatInputComponent } from './chat/chat-input/chat-input.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatListComponent, ChatInputComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
