'use strict';

/**
 * ============================================================================
 * GAME LOGIC & POLYOMINO SHAPES
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Standard Tetris-Style Blocks (7 Classic Tetrominoes + Rotations)
// ----------------------------------------------------------------------------
// I-piece: A straight line of 4 blocks
const PIECE_I_H = [[0, 0], [1, 0], [2, 0], [3, 0]]; // Horizontal
const PIECE_I_V = [[0, 0], [0, 1], [0, 2], [0, 3]]; // Vertical

// O-piece: A 2×2 square
const PIECE_O = [[0, 0], [1, 0], [0, 1], [1, 1]];

// T-piece: T-shaped block with 4 squares (4 orientations)
const PIECE_T_DOWN = [[0, 0], [1, 0], [2, 0], [1, 1]];
const PIECE_T_UP = [[1, 0], [0, 1], [1, 1], [2, 1]];
const PIECE_T_RIGHT = [[0, 0], [0, 1], [1, 1], [0, 2]];
const PIECE_T_LEFT = [[1, 0], [0, 1], [1, 1], [1, 2]];

// S-piece: Zigzag shape leaning right (2 orientations)
const PIECE_S_H = [[1, 0], [2, 0], [0, 1], [1, 1]];
const PIECE_S_V = [[0, 0], [0, 1], [1, 1], [1, 2]];

// Z-piece: Zigzag shape leaning left (2 orientations)
const PIECE_Z_H = [[0, 0], [1, 0], [1, 1], [2, 1]];
const PIECE_Z_V = [[1, 0], [0, 1], [1, 1], [0, 2]];

// J-piece: L-shape facing left (4 orientations)
const PIECE_J_0 = [[0, 0], [1, 0], [2, 0], [2, 1]];
const PIECE_J_90 = [[1, 0], [1, 1], [0, 2], [1, 2]];
const PIECE_J_180 = [[0, 0], [0, 1], [1, 1], [2, 1]];
const PIECE_J_270 = [[0, 0], [1, 0], [0, 1], [0, 2]];

// L-piece: L-shape facing right (4 orientations)
const PIECE_L_0 = [[0, 0], [1, 0], [2, 0], [0, 1]];
const PIECE_L_90 = [[0, 0], [1, 0], [1, 1], [1, 2]];
const PIECE_L_180 = [[2, 0], [0, 1], [1, 1], [2, 1]];
const PIECE_L_270 = [[0, 0], [0, 1], [0, 2], [1, 2]];

// ----------------------------------------------------------------------------
// 2. Additional Block Variations (Block Blast Unique Shapes)
// ----------------------------------------------------------------------------
// Single blocks (1×1)
const PIECE_DOT_1X1 = [[0, 0]];

// Domino pieces (1×2 and 2×1)
const PIECE_DOMINO_H = [[0, 0], [1, 0]]; // 2×1
const PIECE_DOMINO_V = [[0, 0], [0, 1]]; // 1×2

// Triomino shapes (3-block straight lines and 3-block L-shapes / small corners)
const PIECE_TRIO_LINE_H = [[0, 0], [1, 0], [2, 0]]; // 3×1
const PIECE_TRIO_LINE_V = [[0, 0], [0, 1], [0, 2]]; // 1×3
const PIECE_TRIO_CORNER_BL = [[0, 0], [0, 1], [1, 1]]; // Bottom-Left
const PIECE_TRIO_CORNER_BR = [[1, 0], [0, 1], [1, 1]]; // Bottom-Right
const PIECE_TRIO_CORNER_TL = [[0, 0], [1, 0], [0, 1]]; // Top-Left
const PIECE_TRIO_CORNER_TR = [[0, 0], [1, 0], [1, 1]]; // Top-Right

// Modified T-pieces with extended arms
const PIECE_CROSS = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]; // Plus / Cross shape (5 blocks)
const PIECE_BIG_T_DOWN = [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]; // Extended stem down (5 blocks)
const PIECE_BIG_T_UP = [[1, 0], [1, 1], [0, 2], [1, 2], [2, 2]]; // Extended stem up (5 blocks)
const PIECE_WIDE_T = [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1]]; // Extended arms (5 blocks)

// Corner pieces and irregular shapes
// Big 3×3 L-Corner pieces (5 blocks, 4 orientations)
const PIECE_BIG_CORNER_TL = [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]]; // Top-Left
const PIECE_BIG_CORNER_TR = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]; // Top-Right
const PIECE_BIG_CORNER_BL = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Left
const PIECE_BIG_CORNER_BR = [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Right

// Irregular U-shapes / C-shapes (5 blocks)
const PIECE_U_SHAPE_UP = [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; // Open top
const PIECE_U_SHAPE_DOWN = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]]; // Open bottom

// Larger rectangular blocks (1×3, 1×4, 1×5, 2×3, 3×2, 3×3)
const PIECE_LINE_5_H = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]; // 5×1
const PIECE_LINE_5_V = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]; // 1×5
const PIECE_RECT_3X2 = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; // 3 wide, 2 tall (6 blocks)
const PIECE_RECT_2X3 = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]; // 2 wide, 3 tall (6 blocks)
const PIECE_SQUARE_3X3 = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2]
]; // 3×3 solid square (9 blocks)

// Master shape definition pool
const shape_def = [
  // 1. Standard Tetris 7 Pieces
  PIECE_I_H,
  PIECE_I_V,
  PIECE_O,
  PIECE_T_DOWN,
  PIECE_T_UP,
  PIECE_T_RIGHT,
  PIECE_T_LEFT,
  PIECE_S_H,
  PIECE_S_V,
  PIECE_Z_H,
  PIECE_Z_V,
  PIECE_J_0,
  PIECE_J_90,
  PIECE_J_180,
  PIECE_J_270,
  PIECE_L_0,
  PIECE_L_90,
  PIECE_L_180,
  PIECE_L_270,

  // 2. Block Blast Variations
  PIECE_DOT_1X1,
  PIECE_DOMINO_H,
  PIECE_DOMINO_V,
  PIECE_TRIO_LINE_H,
  PIECE_TRIO_LINE_V,
  PIECE_TRIO_CORNER_BL,
  PIECE_TRIO_CORNER_BR,
  PIECE_TRIO_CORNER_TL,
  PIECE_TRIO_CORNER_TR,
  PIECE_CROSS,
  PIECE_BIG_T_DOWN,
  PIECE_BIG_T_UP,
  PIECE_WIDE_T,
  PIECE_BIG_CORNER_TL,
  PIECE_BIG_CORNER_TR,
  PIECE_BIG_CORNER_BL,
  PIECE_BIG_CORNER_BR,
  PIECE_U_SHAPE_UP,
  PIECE_U_SHAPE_DOWN,
  PIECE_LINE_5_H,
  PIECE_LINE_5_V,
  PIECE_RECT_3X2,
  PIECE_RECT_2X3,
  PIECE_SQUARE_3X3
];

const SHAPE_DEFINITIONS = shape_def;

let pieceSeq = 1;

/**
 * Generate a single random polyomino piece
 */
function generatePiece() {
  const cells = shape_def[Math.floor(Math.random() * shape_def.length)];
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
  shape_def,
  SHAPE_DEFINITIONS,
  generatePiece,
  generateRack,
  canFitAnywhere
};
