'use strict';

/**
 * ============================================================================
 * GAME LOGIC & POLYOMINO SHAPES
 * ============================================================================
 */

// Standard Polyomino shapes matching [[dx, dy]] coordinates
const SHAPE_DEFINITIONS = [
  [[0, 0]],
  [[0, 0], [1, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [0, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]]
];

let pieceSeq = 1;

/**
 * Generate a single random polyomino piece
 */
function generatePiece() {
  const cells = SHAPE_DEFINITIONS[Math.floor(Math.random() * SHAPE_DEFINITIONS.length)];
  return {
    id: 'pc_' + (pieceSeq++),
    cells: cells
  };
}

/**
 * Generate a rack of 3 random pieces
 */
function generateRack() {
  return [generatePiece(), generatePiece(), generatePiece()];
}

/**
 * Check if any piece in the rack can fit anywhere on the 8x8 grid
 */
function canFitAnywhere(grid, rack) {
  for (const piece of rack) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const fits = piece.cells.every(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          return nx < 8 && ny < 8 && grid[ny][nx] === 0;
        });
        if (fits) return true;
      }
    }
  }
  return false;
}

module.exports = {
  SHAPE_DEFINITIONS,
  generatePiece,
  generateRack,
  canFitAnywhere
};
