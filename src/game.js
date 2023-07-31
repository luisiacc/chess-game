import { PieceType, Color } from "./pieces.js";
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
  let whiteEl = document.querySelector("#player-white-turn");
  let blackEl = document.querySelector("#player-black-turn");
  if (newTurn == Color.Black) {
    blackEl.innerHTML = "🟢";
    whiteEl.innerHTML = "";
  } else {
    blackEl.innerHTML = "";
    whiteEl.innerHTML = "🟢";
  }
}

function updateElementTime(color, time) {
  time = Math.max(time, 0);
  const el = document.querySelector(`#player-${color}-time`);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  el.innerHTML = `${minutes}:${paddedSeconds}`;
}

export class Game {
  constructor(board, time) {
    this.board = board;
    this.turn = Color.White;

    this.check = false;
    this.checkmate = false;
    this.stalemate = false;
    this.selectedPiece = null;

    this.whiteKingMoved = false;
    this.blackKingMoved = false;
    this.time = time || 5 * 60;

    this.whiteTimeLeft = this.time;
    this.blackTimeLeft = this.time;

    this.currentInterval = null;
  }

  getKing(color) {
    for (let i = 0; i < this.board.rows; i++) {
      for (let j = 0; j < this.board.columns; j++) {
        const piece = this.board.board[i][j];
        if (piece?.type === PieceType.King && piece.color === color) {
          return piece;
        }
      }
    }
  }

  isCheck(king) {
    for (let i = 0; i < this.board.rows; i++) {
      for (let j = 0; j < this.board.columns; j++) {
        const piece = this.board.board[i][j];
        if (!piece) {
          continue;
        }
        if (piece.color !== king.color) {
          const positions = piece.takingMoves(this);
          if (
            positions.some(
              (position) =>
                position[0] === king.positionY &&
                position[1] === king.positionX,
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isCheckmate() {
    const king = this.getKing(this.turn);
    const positions = king.possibleMoves(this);
    return positions.length === 0 && this.isCheck(king);
  }

  endGame() {
    window.alert("Mate con tomate");
  }

  showCheckMessage() {
    window.alert("Check!");
  }

  changeTurn() {
    if (this.turn === Color.White) {
      this.turn = Color.Black;
    } else {
      this.turn = Color.White;
    }
    updateDraggableStateOnBoard(this.board, this.turn);
    updateTurnText(this.turn);

    // trigger intervals
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
    this.currentInterval = setInterval(() => {
      if (this.turn === Color.White) {
        this.whiteTimeLeft--;
        updateElementTime(this.turn, this.whiteTimeLeft);
      } else {
        this.blackTimeLeft--;
        updateElementTime(this.turn, this.blackTimeLeft);
      }
    }, 1000);
  }
}
