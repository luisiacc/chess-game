import {
  cellIsEmpty,
  positionIsInPossibleMoves as positionIsInMoves,
} from "./utils.js";

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

function getPositionsCoveredByEnemyPieces(game, color) {
  const board = game.board.board;
  const moves = new Set();
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      const piece = row[j];
      if (piece && piece.color !== color && piece.type !== PieceType.King) {
        moves.add(...piece.takingMoves(game).map((x) => x.join(",")));
      }
    }
  }
  // this is a set of strings, is faster to check for string in sets
  return moves;
}

class Piece {
  constructor(color, type, board) {
    this.color = color;
    this.type = type;

    this.positionX = null;
    this.positionY = null;
  }

  possibleMoves(game) {
    return [];
  }

  takingMoves(game) {
    return this.possibleMoves(game);
  }
}

class Pawn extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "P";
  }

  possibleMoves(game) {
    const board = game.board.board;
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

  takingMoves(game) {
    const board = game.board.board;
    const moves = [];
    const direction = this.color === Color.White ? -1 : 1;
    const nextRow = this.positionY + direction;

    const leftDiagonal = this.positionX - 1;
    const rightDiagonal = this.positionX + 1;
    if (leftDiagonal >= 0) {
      moves.push([nextRow, leftDiagonal]);
    }

    if (rightDiagonal >= 0) {
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

  possibleMoves(game) {
    const board = game.board.board;
    const moves = [];
    const possibleMoves = [
      [this.positionY - 2, this.positionX - 1],
      [this.positionY - 2, this.positionX + 1],
      [this.positionY - 1, this.positionX - 2],
      [this.positionY - 1, this.positionX + 2],
      [this.positionY + 1, this.positionX - 2],
      [this.positionY + 1, this.positionX + 2],
      [this.positionY + 2, this.positionX - 1],
      [this.positionY + 2, this.positionX + 1],
    ];

    possibleMoves.forEach((move) => {
      const [y, x] = move;
      if (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
        if (
          cellIsEmpty(board[y][x]) ||
          (board[y][x].color !== this.color &&
            board[y][x]?.type !== PieceType.King)
        ) {
          moves.push(move);
        }
      }
    });

    return moves;
  }
}

class Bishop extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "B";
  }

  possibleMoves(game) {
    const board = game.board.board;
    const moves = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    directions.forEach((direction) => {
      const [y, x] = direction;
      let nextY = this.positionY + y;
      let nextX = this.positionX + x;

      while (nextY >= 0 && nextY <= 7 && nextX >= 0 && nextX <= 7) {
        if (cellIsEmpty(board[nextY][nextX])) {
          moves.push([nextY, nextX]);
        } else if (
          board[nextY][nextX].color !== this.color &&
          board[nextY][nextX]?.type !== PieceType.King
        ) {
          moves.push([nextY, nextX]);
          break;
        } else {
          break;
        }

        nextY += y;
        nextX += x;
      }
    });

    return moves;
  }
}

class Rook extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "R";
  }

  possibleMoves(game) {
    const board = game.board.board;
    const moves = [];
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    directions.forEach((direction) => {
      const [y, x] = direction;
      let nextY = this.positionY + y;
      let nextX = this.positionX + x;

      while (nextY >= 0 && nextY <= 7 && nextX >= 0 && nextX <= 7) {
        if (cellIsEmpty(board[nextY][nextX])) {
          moves.push([nextY, nextX]);
        } else if (
          board[nextY][nextX].color !== this.color &&
          board[nextY][nextX]?.type !== PieceType.King
        ) {
          moves.push([nextY, nextX]);
          break;
        } else {
          break;
        }

        nextY += y;
        nextX += x;
      }
    });

    return moves;
  }
}

class Queen extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "Q";
  }

  possibleMoves(game) {
    const board = game.board.board;
    const moves = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    directions.forEach((direction) => {
      const [y, x] = direction;
      let nextY = this.positionY + y;
      let nextX = this.positionX + x;

      while (nextY >= 0 && nextY <= 7 && nextX >= 0 && nextX <= 7) {
        if (cellIsEmpty(board[nextY][nextX])) {
          moves.push([nextY, nextX]);
        } else if (
          board[nextY][nextX].color !== this.color &&
          board[nextY][nextX]?.type !== PieceType.King
        ) {
          moves.push([nextY, nextX]);
          break;
        } else {
          break;
        }

        nextY += y;
        nextX += x;
      }
    });

    return moves;
  }
}

class King extends Piece {
  constructor(color, type) {
    super(color, type);
    this.text = "Ki";
  }

  possibleMoves(game) {
    const board = game.board.board;
    const moves = [];
    const possibleMoves = [
      [this.positionY - 1, this.positionX - 1],
      [this.positionY - 1, this.positionX],
      [this.positionY - 1, this.positionX + 1],
      [this.positionY, this.positionX - 1],
      [this.positionY, this.positionX + 1],
      [this.positionY + 1, this.positionX - 1],
      [this.positionY + 1, this.positionX],
      [this.positionY + 1, this.positionX + 1],
    ];

    const coveredByEnemies = getPositionsCoveredByEnemyPieces(
      game,
      this.color,
    );
    possibleMoves.forEach((move) => {
      const [y, x] = move;
      const stringPos = `${y},${x}`;
      if (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
        if (
          !coveredByEnemies.has(stringPos) &&
          (cellIsEmpty(board[y][x]) ||
            (board[y][x].color !== this.color &&
              board[y][x]?.type !== PieceType.King))
        ) {
          moves.push(move);
        }
      }
    });

    // check for castling
    if (
      this.color === Color.White &&
      this.positionY === 7 &&
      this.positionX === 4 &&
      !game.whiteKingMoved
    ) {
      if (
        board[7][0]?.type === PieceType.Rook &&
        board[7][0].color === Color.White
      ) {
        if (
          board[7][1] === null &&
          board[7][2] === null &&
          board[7][3] === null
        ) {
          moves.push([7, 2]);
        }
      }
      if (
        board[7][7]?.type === PieceType.Rook &&
        board[7][7].color === Color.White
      ) {
        if (board[7][5] === null && board[7][6] === null) {
          moves.push([7, 6]);
        }
      }
    }

    if (
      this.color === Color.Black &&
      this.positionY === 0 &&
      this.positionX === 4 &&
      !game.blackKingMoved
    ) {
      if (
        board[0][0]?.type === PieceType.Rook &&
        board[0][0].color === Color.Black
      ) {
        if (
          board[0][1] === null &&
          board[0][2] === null &&
          board[0][3] === null
        ) {
          moves.push([0, 2]);
        }
      }
      if (
        board[0][7]?.type === PieceType.Rook &&
        board[0][7].color === Color.Black
      ) {
        if (board[0][5] === null && board[0][6] === null) {
          moves.push([0, 6]);
        }
      }
    }

    return moves;
  }
}

export { Color, PieceType, Pawn, Knight, Bishop, Rook, Queen, King };
