import { cellIsEmpty } from "./utils.js";

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

export { Color, PieceType, Pawn, Knight, Bishop, Rook, Queen, King };
