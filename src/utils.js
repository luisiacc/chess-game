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
