import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  messages: Array<string> = [];

  constructor() { }

  notify(message: string) {
    this.messages.push(message);

    setTimeout(() => {
      this.messages.shift();
    }, 2000);
  }

  clearMessage() {
    this.messages = [];
  }
}
