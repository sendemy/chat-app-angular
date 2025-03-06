import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BroadcastService<T> {
  private channels: Map<string, BroadcastChannel> = new Map();
  private subjects: Map<string, Subject<T>> = new Map();

  constructor(private ngZone: NgZone) {}

  getChannel(channelName: string): Subject<T> {
    if (!this.channels.has(channelName)) {
      const broadcastChannel = new BroadcastChannel(channelName);
      const subject = new Subject<T>();

      broadcastChannel.onmessage = (event) => {
        // expanding Angular's zone since Broadcast Channel API that does not hook into Angular
        this.ngZone.run(() => {
          subject.next(event.data);
        });
      };

      this.channels.set(channelName, broadcastChannel);
      this.subjects.set(channelName, subject);
    }

    return this.subjects.get(channelName)!;
  }

  sendMessage(channelName: string, message: T): void {
    if (!this.channels.has(channelName)) {
      throw new Error(`Channel '${channelName}' does not exist.`);
    }

    const broadcastChannel = this.channels.get(channelName)!;
    broadcastChannel.postMessage(message);

    const subject = this.subjects.get(channelName)!;
    subject.next(message);
  }
}
