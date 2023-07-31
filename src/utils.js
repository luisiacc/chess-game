export function getCellCode(row, col) {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return letters[col] + (8 - row);
}

export function cellIsEmpty(cell) {
  return cell === null || cell === undefined;
}

export function makeCellDraggable(cell) {
  cell.style.cursor = "pointer";
  cell.setAttribute("draggable", true);
}

export function makeCellUndraggable(cell) {
  cell.style.cursor = "default";
  cell.setAttribute("draggable", false);
}

export function positionIsInPossibleMoves(position, possibleMoves) {
  return possibleMoves.some((move) => {
    return position[0] === move[0] && position[1] === move[1];
  });
}

export async function emitPieceSound() {
  let audio = new Audio("assets/sound.wav");
  audio.volume = 0.1;
  audio.play();
}
