import { Injectable } from '@angular/core';
import { Observable, fromEvent, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyEventService {

  constructor() { }

  getInputKeyEvents(): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(keyCodeFilter)
      );
  }
}

const keyCodeFilter = (e: KeyboardEvent): boolean => {
  console.log(e.keyCode);
  return (e.keyCode >= 65 && e.keyCode <= 90)
    || e.keyCode === 8 || e.keyCode === 13;
};
