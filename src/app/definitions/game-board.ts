export namespace GameBoard {
  export enum Guess {Absent, Present, Correct};
  export type Cell = {guess?: Guess, char?: string};
  export type Row = [Cell, Cell, Cell, Cell, Cell];
  export type Board = [Row, Row, Row, Row, Row, Row];
  export const CHARS = 5;
  export const ROWS = 6;
}
