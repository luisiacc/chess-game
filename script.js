const Color = {
  White: "white",
  Black: "black",
};

const PieceType = {
  Pawn: "pawn",
  Knight: "knight",
  Bishop: "bishop",
  Rook: "rook",
  Queen: "queen",
  King: "king",
};

function cellIsEmpty(cell) {
  return cell === null || cell === undefined;
}

function positionIsInPossibleMoves(position, possibleMoves) {
  for (let i = 0; i < possibleMoves.length; i++) {
    if (
      position[0] === possibleMoves[i][0] &&
      position[1] === possibleMoves[i][1]
    ) {
      return true;
    }
  }
  return false;
}

class Piece {
  constructor(color, type, board) {
    this.color = color;
    this.type = type;

    this.positionX = null;
    this.positionY = null;
  }

  possibleMoves(board) {
    return [];
  }
}

class Pawn extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "P";
  }

  possibleMoves(board) {
    // generate all possible moves a pawn can make, returns a list of moves in the form of [y, x]
    const moves = [];
    const direction = this.color === Color.White ? -1 : 1;
    const startingRow = this.color === Color.White ? 6 : 1;
    const nextRow = this.positionY + direction;
    const nextNextRow = this.positionY + 2 * direction;

    // check if the next row is empty
    if (cellIsEmpty(board[nextRow][this.positionX])) {
      moves.push([nextRow, this.positionX]);
    }

    // check if the next next row is empty and the pawn is in the starting row
    if (
      this.positionY === startingRow &&
      cellIsEmpty(board[nextRow][this.positionX]) && // check if the next row is empty
      cellIsEmpty(board[nextNextRow][this.positionX])
    ) {
      moves.push([nextNextRow, this.positionX]);
    }

    // check if the pawn can take a piece
    const leftDiagonal = this.positionX - 1;
    const rightDiagonal = this.positionX + 1;
    if (
      leftDiagonal >= 0 &&
      !cellIsEmpty(board[nextRow][leftDiagonal]) &&
      board[nextRow][leftDiagonal].color !== this.color &&
      board[nextRow][leftDiagonal]?.type !== PieceType.King
    ) {
      moves.push([nextRow, leftDiagonal]);
    }

    if (
      rightDiagonal >= 0 &&
      !cellIsEmpty(board[nextRow][rightDiagonal]) &&
      board[nextRow][rightDiagonal]?.color !== this.color &&
      board[nextRow][rightDiagonal]?.type !== PieceType.King
    ) {
      moves.push([nextRow, rightDiagonal]);
    }

    return moves;
  }
}

class Knight extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "K";
  }
}

class Bishop extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "B";
  }
}

class Rook extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "R";
  }
}

class Queen extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "Q";
  }
}

class King extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "Ki";
  }
}

function makeCellDraggable(cell) {
  cell.style.cursor = "pointer";
  cell.setAttribute("draggable", true);
}

function makeCellUndraggable(cell) {
  cell.style.cursor = "default";
  cell.setAttribute("draggable", false);
}

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
    makeCellDraggable(fromCell);
  };

  this.movePiece = function (fromRow, fromCol, toRow, toCol) {
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;
    // TODO: do something when it's taking
    if (this.board[toRow][toCol]) {
      this.board[toRow][toCol].positionX = toCol;
      this.board[toRow][toCol].positionY = toRow;
    }
    this.redrawAfterMove(fromRow, fromCol, toRow, toCol);
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

function getCellCode(row, col) {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return letters[col] + (Board.rows - row);
}

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
    makeCellDraggable(cell);
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
    possibleCells = realPiece.possibleMoves(Board.board);
    drawPossibleCells(possibleCells);
  });

  cell.addEventListener("dragenter", function (event) {
    // check if the cell is in the possible moves
    const fromPosition = draggedElementData;
    const [fromRow, fromCol] = fromPosition.split(",").map((x) => parseInt(x));
    const piece = Board.getPiece(fromRow, fromCol);
    if (piece) {
      const movesAsString = piece
        .possibleMoves(Board.board)
        .map((x) => x.join(","));
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
    if (
      positionIsInPossibleMoves(
        [toRow, toCol],
        piece.possibleMoves(Board.board),
      )
    ) {
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
