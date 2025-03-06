import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../config/AppConfig';
import { BroadcastService } from '../broadcast/broadcast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hasNameSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('userName')
  );

  constructor(private broadcastService: BroadcastService<boolean>) {
    this.broadcastService
      .getChannel(AppConfig.CHANNEL_NAMES.AUTH)
      .subscribe((hasName) => {
        this.hasNameSubject.next(hasName);
      });
  }

  get hasName(): boolean {
    return this.hasNameSubject.value;
  }

  get hasName$() {
    return this.hasNameSubject.asObservable();
  }

  set hasName(value: boolean) {
    this.hasNameSubject.next(value);
    this.broadcastService.sendMessage(AppConfig.CHANNEL_NAMES.AUTH, value);
  }
}
