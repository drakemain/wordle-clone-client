import { Component, OnInit, } from '@angular/core';

import { KeyEventService } from './../key-event.service';
import { GuessService } from './../guess.service';
import { NotificationService } from './../notification.service';
import { KeyboardService } from './../keyboard.service';
import { GameBoard } from '../definitions/game-board';
import { ServerResponse } from './../definitions/ServerResponse';

enum GameState {
  Playing,
  Won,
  Lost
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: GameBoard.Board = makeBoard();
  currentRow = 0;
  currentTile = 0;
  gameState: GameState = GameState.Playing;

  constructor(
    private keyEvents: KeyEventService,
    private guess: GuessService,
    private notification: NotificationService,
    private keyboard: KeyboardService
  ) { }

  ngOnInit(): void {
    this.keyEvents.getInputKeyEvents().subscribe(e => {
      this.onKeyEvent(e);
    });
  }

  private onKeyEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'Enter':
        this.onReturnKey();
        break;
      case 'Backspace':
        this.onBackspaceKey();
        break;
      default:
        this.setCurrentTileChar(event.key);
        this.incrementTile();
    }
  }

  private onBackspaceKey() {
    if ((this.currentTile === this.board[this.currentRow].length - 1)
      && (this.getCurrentTileCell().char)) {
        this.resetCurrentTileChar();
    } else {
      this.decrementTile();
      this.resetCurrentTileChar();
    }
  }

  private onReturnKey() {
    const row = this.board[this.currentRow];
    let word: string = '';

    for (let cell of row) {
      if (cell.char) {
        word += cell.char;
      } else {
        this.notification.notify(`${word} too short!`);
        return;
      }
    }

    this.guess.submit(word).subscribe(res => {
      if (res.errcode) {
        console.error(`Server responded to guess with error: ${res.errmsg}`);
        switch(res.errcode) {
          case ServerResponse.ErrorCode.GuessBadLen:
            this.notification.notify(`${word} too short!`);
            break;
          case ServerResponse.ErrorCode.WordNotInList:
            this.notification.notify(`${word} is not a valid word.`);
        }
      } else if (res.payload) {
        this.setCurrentRowGuess(res.payload);
        const row = this.board[this.currentRow];

        for (let i = 0; i < row.length; ++i) {
          console.log('test');
          this.keyboard.setKeyState(row[i].char!, res.payload[i]);
        }

        if (this.checkWinCondition(res.payload)) {
          this.gameState = GameState.Won;
        } else {
          this.incrementRow();
        }
      } else {
        throw new Error('Unknown server response.');
      }
    });
  }

  private checkWinCondition(guess: ServerResponse.Payload): boolean {
    let res = true;

    for (let cell of guess) {
      if (cell !== GameBoard.Guess.Correct) {
        res = false;
        break;
      }
    }

    return res;
  }

  private setCurrentRowGuess(guessResponse: ServerResponse.Payload) {
    const row = this.board[this.currentRow];
    if (guessResponse.length !== row.length) {
      throw new Error('Bad guess response from server');
    }

    for (let i = 0; i < guessResponse.length; ++i) {
      row[i].guess = guessResponse[i];
    }
  }

  private getCurrentTileCell(): GameBoard.Cell {
    return this.board[this.currentRow][this.currentTile];
  }

  private setCurrentTileChar(char: string) {
    if (char.length !== 1) {
      throw new Error('Tried to set tile to non-char length value.');
    } 

    if (!this.getCurrentTileCell().char) {
      this.getCurrentTileCell().char = char;
    }
  }

  private resetCurrentTileChar() {
    this.getCurrentTileCell().char = undefined;
  }

  private setRow(row: number): boolean {
    const result = row < this.board.length;

    if (result) {
      this.currentRow = row;
      this.currentTile = 0;
    }

    return result;
  }

  private setTile(tile: number) {
    const result = tile < this.board[this.currentRow].length
      && tile >= 0;

    if (result) {
      this.currentTile = tile;
    }

    return result;
  }

  private incrementRow() {
    const success = this.setRow(this.currentRow + 1);

    if (!success) {
      this.gameState = GameState.Lost;
    }
  }

  private incrementTile() {
    this.setTile(this.currentTile + 1);
  }

  private decrementTile() {
    this.setTile(this.currentTile - 1);
  }
}

const makeBoard = (): GameBoard.Board => {
  return [
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}]
  ];
};
