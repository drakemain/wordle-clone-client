import { Injectable } from '@angular/core';
import { GameBoard } from './definitions/game-board';
import { KeyboardComponent } from './keyboard/keyboard.component';

enum KeyState {
  Absent,
  Present,
  Correct,
  Unused,
};

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  keys: Array<Map<string, KeyState>>;

  constructor() {
    this.keys = KeyboardService.makeKeys();
    console.log(this.keys);
  }

  triggerKeyEvent(char: string) {
    const event: KeyboardEvent = new KeyboardEvent('keydown', 
      KeyboardService.createKeyEventProperties(char));

    console.log(event);

    document.dispatchEvent(event);
  }

  setKeyState(key: string, newState: GameBoard.Guess) {
    console.log('test');
    let correctRow;

    for (let row of this.keys) {
      if (row.has(key)) {
        correctRow = row;
        break;
      }
    }

    if (correctRow) {
      const keyState = correctRow.get(key);

      if (keyState) {
        switch(keyState) {
          case KeyState.Correct:
            break;
          case KeyState.Present:
            if (newState === GameBoard.Guess.Correct) {
              correctRow.set(key, KeyState.Correct);
            }
            break;
          default:
            correctRow.set(key, KeyboardService.guessToKeyState(newState));
        }
      }
    }

    console.log(this.keys);
  }

  private static guessToKeyState(guess: GameBoard.Guess): KeyState {
    switch (guess) {
      case GameBoard.Guess.Absent:
        return KeyState.Absent;
      case GameBoard.Guess.Present:
        return KeyState.Present;
      case GameBoard.Guess.Correct:
        return KeyState.Correct;
    }
  }

  private static mapCharToKeyCode(char: string): number {
    const charCode = char.charCodeAt(0);
    
    if (char.length !== 1) {
      return 0;
    } else if (charCode >= 97 && charCode <= 122) {
      return charCode - 32;
    } else if (char === '⏎'){
      return 13;
    } else if (char === '<') {
      return 8;
    }

    return 0;
  }

  private static createKeyEventProperties(char: string): KeyboardEventInit {
    const charCode = char.charCodeAt(0);
    let key = '';
    if (charCode >= 97 && charCode <= 122) {
      key = char;
    } else if (char === '⏎') {
      key = 'Enter';
    } else if (char === '<') {
      key = 'Backspace';
    }

    return {key, keyCode: KeyboardService.mapCharToKeyCode(char)};

  }

  private static makeKeys(): Array<Map<string, KeyState>> {
    const rows = [['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['⏎','z','x','c','v','b','n','m', '<']];

    let result = [];

    for (let row of rows) {
      const keys = new Map();

      for (let char of row) {
        keys.set(char, KeyState.Unused);
      }

      result.push(keys);
    }

    return result;
  }
}
