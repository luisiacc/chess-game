import { Game } from "./game.js";
import {
  Color,
  PieceType,
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
} from "./pieces.js";

import {
  makeCellDraggable,
  positionIsInPossibleMoves,
  makeCellUndraggable,
  getCellCode,
  emitPieceSound,
} from "./utils.js";

function getBoardInstance() {
  this.rows = 8;
  this.columns = 8;
  this.board = Array.from({ length: this.rows });

  for (let i = 0; i < this.rows; i++) {
    this.board[i] = Array.from({ length: this.columns });
  }

  // put pieces
  const whitePawnPosition = 6;
  const blackPawnPosition = 1;
  for (let i = 0; i < this.columns; i++) {
    this.board[whitePawnPosition][i] = new Pawn(Color.White, PieceType.Pawn);
    this.board[blackPawnPosition][i] = new Pawn(Color.Black, PieceType.Pawn);
  }

  const rookPositions = [0, 7];
  for (let i = 0; i < rookPositions.length; i++) {
    this.board[7][rookPositions[i]] = new Rook(Color.White, PieceType.Rook);
    this.board[0][rookPositions[i]] = new Rook(Color.Black, PieceType.Rook);
  }

  const knightPositions = [1, 6];
  for (let i = 0; i < knightPositions.length; i++) {
    this.board[7][knightPositions[i]] = new Knight(
      Color.White,
      PieceType.Knight,
    );
    this.board[0][knightPositions[i]] = new Knight(
      Color.Black,
      PieceType.Knight,
    );
  }

  const bishopPositions = [2, 5];
  for (let i = 0; i < bishopPositions.length; i++) {
    this.board[7][bishopPositions[i]] = new Bishop(
      Color.White,
      PieceType.Bishop,
    );
    this.board[0][bishopPositions[i]] = new Bishop(
      Color.Black,
      PieceType.Bishop,
    );
  }

  this.board[7][3] = new Queen(Color.White, PieceType.Queen);
  this.board[0][3] = new Queen(Color.Black, PieceType.Queen);

  this.board[7][4] = new King(Color.White, PieceType.King);
  this.board[0][4] = new King(Color.Black, PieceType.King);

  this.getPiece = function (row, col) {
    return this.board[row][col];
  };

  this.getPieceFromElement = function (element) {
    // position is a string 4,5 for ex
    const [row, col] = element.dataset.position
      .split(",")
      .map((x) => parseInt(x));
    return this.board[row][col];
  };

  this.redrawAfterMove = function (fromRow, fromCol, toRow, toCol) {
    const getCurrentCell = (row, col) => {
      return document.querySelector(`#${getCellCode(row, col)}`);
    };
    const fromCell = getCurrentCell(fromRow, fromCol);
    const toCell = getCurrentCell(toRow, toCol);

    toCell.setAttribute("style", fromCell.getAttribute("style"));
    fromCell.setAttribute("style", "");
    makeCellDraggable(toCell);
    makeCellUndraggable(fromCell);
  };

  this.movePiece = function (
    fromRow,
    fromCol,
    toRow,
    toCol,
    changeTurn = true,
  ) {
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;
    // TODO: do something when it's taking
    if (this.board[toRow][toCol]) {
      this.board[toRow][toCol].positionX = toCol;
      this.board[toRow][toCol].positionY = toRow;
    }
    this.redrawAfterMove(fromRow, fromCol, toRow, toCol);
    emitPieceSound();

    // check for castle
    if (this.board[toRow][toCol] instanceof King) {
      let color = this.board[toRow][toCol].color;
      if (color == Color.White) {
        game.whiteKingMoved = true;
      } else {
        game.blackKingMoved = true;
      }
      if (toCol - fromCol === 2) {
        this.movePiece(toRow, 7, toRow, 5, false);
      } else if (toCol - fromCol === -2) {
        this.movePiece(toRow, 0, toRow, 3, false);
      }
    }

    if (changeTurn) {
      game.changeTurn();
    }
  };

  this.cachePiecesPositions = function () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const piece = this.board[i][j];
        if (piece) {
          piece.positionX = j;
          piece.positionY = i;
        }
      }
    }
  };
}

const Board = new getBoardInstance();
Board.cachePiecesPositions();
const game = new Game(Board);

const pieceImage = {
  [Color.White]: {
    [PieceType.Pawn]: "white-pawn.png",
    [PieceType.Knight]: "white-knight.png",
    [PieceType.Bishop]: "white-bishop.png",
    [PieceType.Rook]: "white-rook.png",
    [PieceType.Queen]: "white-queen.png",
    [PieceType.King]: "white-king.png",
  },
  [Color.Black]: {
    [PieceType.Pawn]: "black-pawn.png",
    [PieceType.Knight]: "black-knight.png",
    [PieceType.Bishop]: "black-bishop.png",
    [PieceType.Rook]: "black-rook.png",
    [PieceType.Queen]: "black-queen.png",
    [PieceType.King]: "black-king.png",
  },
};

let possibleCells = [];

function drawPossibleCells(positions) {
  positions.forEach((position) => {
    let cell = document.querySelector(
      `#${getCellCode(position[0], position[1])}`,
    );
    if (!cell) {
      return;
    }
    cell.classList.add("possible-move");
  });
}

function removePossibleCells(positions) {
  positions.forEach((position) => {
    let cell = document.querySelector(
      `#${getCellCode(position[0], position[1])}`,
    );
    if (!cell) {
      return;
    }
    cell.classList.remove("possible-move");
  });
}

let draggedElementData = null;

function getCell(row, col, piece) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("id", getCellCode(row, col));
  cell.setAttribute("data-code", getCellCode(row, col));
  cell.setAttribute("data-position", `${row},${col}`);

  const color = (row + col) % 2 === 0 ? Color.White : Color.Black;
  const bgColor = {
    [Color.White]: "bg-white",
    [Color.Black]: "bg-black",
  };
  cell.classList.add(bgColor[color]);
  if (piece) {
    cell.style.backgroundImage = `url('./pieces-assets/${
      pieceImage[piece.color][piece.type]
    }')`;
    cell.style.backgroundSize = "cover";
    if (piece.color == Color.White) {
      makeCellDraggable(cell);
    }
  }

  // add listener to accept drop
  cell.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.position);
    draggedElementData = event.target.dataset.position;
    event.target.style.backgroundColor = "transparent";
    event.target.style.border = "none";
    event.target.style.outline = "none";
    event.target.style.opacity = "0.95"; // temporal to remove outline when dragging
    // mark possible moves of the piece
    // can't use cell directly because this listener is on the starting cell, we have to get
    // the piece from the board
    const [row, col] = event.target.dataset.position
      .split(",")
      .map((x) => parseInt(x));
    let realPiece = Board.getPiece(row, col);
    possibleCells = realPiece.possibleMoves(game);
    drawPossibleCells(possibleCells);
  });

  cell.addEventListener("dragenter", function (event) {
    // check if the cell is in the possible moves
    const fromPosition = draggedElementData;
    const [fromRow, fromCol] = fromPosition.split(",").map((x) => parseInt(x));
    const piece = Board.getPiece(fromRow, fromCol);
    if (piece) {
      const movesAsString = piece.possibleMoves(game).map((x) => x.join(","));
      const thisPosition = `${row},${col}`;
      if (movesAsString.includes(thisPosition)) {
        cell.style.backgroundColor = "yellow";
      }
    }
  });
  cell.addEventListener("dragover", function (event) {
    // this allows dropping
    event.preventDefault();
  });
  cell.addEventListener("dragleave", function (event) {
    cell.style.backgroundColor = "";
  });
  cell.addEventListener("dragend", function (event) {
    cell.style.backgroundColor = "";
    removePossibleCells(possibleCells);
    possibleCells = [];
  });

  cell.addEventListener("drop", function (event) {
    cell.style.backgroundColor = "";
    const fromPosition = event.dataTransfer.getData("text/plain");
    const [fromRow, fromCol] = fromPosition.split(",").map((x) => parseInt(x));
    const [toRow, toCol] = cell.dataset.position
      .split(",")
      .map((x) => parseInt(x));
    // edge case for dropping on the same cell
    if (fromRow === toRow && fromCol === toCol) {
      return;
    }
    let piece = Board.getPiece(fromRow, fromCol);
    if (positionIsInPossibleMoves([toRow, toCol], piece.possibleMoves(game))) {
      Board.movePiece(fromRow, fromCol, toRow, toCol);
    }
    event.preventDefault();
  });

  return cell;
}

function getBoardElement() {
  const board = document.createElement("div");
  board.classList.add("board");
  // build board with 8 rows and 8 columns
  for (let i = 0; i < Board.rows; i++) {
    for (let j = 0; j < Board.columns; j++) {
      board.appendChild(getCell(i, j, Board.getPiece(i, j)));
    }
  }
  return board;
}

const el = document.querySelector("#main");
el.appendChild(getBoardElement());
