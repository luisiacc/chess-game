import { Color } from "./pieces.js";
import {
  getCellCode,
  makeCellDraggable,
  makeCellUndraggable,
} from "./utils.js";

function updateDraggableStateOnBoard(board, draggableColor) {
  for (let i = 0; i < board.rows; i++) {
    for (let j = 0; j < board.columns; j++) {
      let cell = document.getElementById(getCellCode(i, j));
      if (board.board[i][j]?.color === draggableColor) {
        makeCellDraggable(cell);
      } else {
        makeCellUndraggable(cell);
      }
    }
  }
}

function updateTurnText(newTurn) {
  let text = "It's White's turn";
  if (newTurn == Color.Black) {
    text = "It's Black's turn";
  }
  let el = document.querySelector("#turn");
  el.innerHTML = text;
}

export class Game {
  constructor(board) {
    this.board = board;
    this.turn = Color.White;
    this.check = false;
    this.checkmate = false;
    this.stalemate = false;
    this.selectedPiece = null;

    this.whiteKingMoved = false;
    this.blackKingMoved = false;
  }

  changeTurn() {
    if (this.turn === Color.White) {
      this.turn = Color.Black;
    } else {
      this.turn = Color.White;
    }
    updateDraggableStateOnBoard(this.board, this.turn);
    updateTurnText(this.turn);
  }
}
