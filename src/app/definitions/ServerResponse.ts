import { GameBoard } from './game-board';

export namespace ServerResponse {
  export type GuessResponse = {
    errmsg?: string,
    errcode?: ErrorCode,
    payload?: Payload
  };

  export enum ErrorCode {
    None,
    GuessBadLen,
    WordNotInList
  };

  export type Payload = [ 
    GameBoard.Guess,
    GameBoard.Guess,
    GameBoard.Guess,
    GameBoard.Guess,
    GameBoard.Guess
  ];
}
