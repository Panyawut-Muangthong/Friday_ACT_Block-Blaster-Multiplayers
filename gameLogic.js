'use strict';

/**
 * ============================================================================
 * GAME LOGIC & POLYOMINO SHAPES
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Single Cubes & Squares
// ----------------------------------------------------------------------------
// The Dot (1x1): A single block
const PIECE_DOT_1X1 = [[0, 0]];

// Small Square (2x2): Standard 4-block square
const PIECE_O = [
  [0, 0], [1, 0],
  [0, 1], [1, 1]
];

// Giant Square (3x3): Massive 9-block tile
const PIECE_SQUARE_3X3 = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2]
];

// ----------------------------------------------------------------------------
// 2. Lines & Bars
// ----------------------------------------------------------------------------
// 2-Block Bar: Measures 1x2 or 2x1
const PIECE_DOMINO_H = [[0, 0], [1, 0]]; // 2x1
const PIECE_DOMINO_V = [[0, 0], [0, 1]]; // 1x2

// 3-Block Bar: Measures 1x3 or 3x1
const PIECE_TRIO_LINE_H = [[0, 0], [1, 0], [2, 0]]; // 3x1
const PIECE_TRIO_LINE_V = [[0, 0], [0, 1], [0, 2]]; // 1x3

// 4-Block Bar: Measures 1x4 or 4x1 (classic Tetris I-piece)
const PIECE_I_H = [[0, 0], [1, 0], [2, 0], [3, 0]]; // 4x1
const PIECE_I_V = [[0, 0], [0, 1], [0, 2], [0, 3]]; // 1x4

// 5-Block Bar: Measures 1x5 or 5x1
const PIECE_LINE_5_H = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]; // 5x1
const PIECE_LINE_5_V = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]; // 1x5

// ----------------------------------------------------------------------------
// 3. L-Shapes & Hooks
// ----------------------------------------------------------------------------
// Small L-Shape: 3-block corner piece (2x2 footprint with one corner missing, 4 orientations)
const PIECE_TRIO_CORNER_BL = [[0, 0], [0, 1], [1, 1]]; // Bottom-Left corner
const PIECE_TRIO_CORNER_BR = [[1, 0], [0, 1], [1, 1]]; // Bottom-Right corner
const PIECE_TRIO_CORNER_TL = [[0, 0], [1, 0], [0, 1]]; // Top-Left corner
const PIECE_TRIO_CORNER_TR = [[0, 0], [1, 0], [1, 1]]; // Top-Right corner

// Standard L-Shape: Made of 4 blocks. Can face left, right, up, or down (L & J tetrominoes)
const PIECE_J_0 = [[0, 0], [1, 0], [2, 0], [2, 1]];
const PIECE_J_90 = [[1, 0], [1, 1], [0, 2], [1, 2]];
const PIECE_J_180 = [[0, 0], [0, 1], [1, 1], [2, 1]];
const PIECE_J_270 = [[0, 0], [1, 0], [0, 1], [0, 2]];

const PIECE_L_0 = [[0, 0], [1, 0], [2, 0], [0, 1]];
const PIECE_L_90 = [[0, 0], [1, 0], [1, 1], [1, 2]];
const PIECE_L_180 = [[2, 0], [0, 1], [1, 1], [2, 1]];
const PIECE_L_270 = [[0, 0], [0, 1], [0, 2], [1, 2]];

// Giant L-Shape: Made of 5 blocks (3 blocks on one side, 3 on the other, sharing a corner, 4 orientations)
const PIECE_BIG_CORNER_TL = [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]]; // Top-Left
const PIECE_BIG_CORNER_TR = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]; // Top-Right
const PIECE_BIG_CORNER_BL = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Left
const PIECE_BIG_CORNER_BR = [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Right

// ----------------------------------------------------------------------------
// 4. T-Shapes, Steps, and Z-Shapes
// ----------------------------------------------------------------------------
// T-Shapes: 4-block piece forming a "T" pointing in four cardinal directions
const PIECE_T_DOWN = [[0, 0], [1, 0], [2, 0], [1, 1]]; // Down
const PIECE_T_UP = [[1, 0], [0, 1], [1, 1], [2, 1]];   // Up
const PIECE_T_RIGHT = [[0, 0], [0, 1], [1, 1], [0, 2]]; // Right
const PIECE_T_LEFT = [[1, 0], [0, 1], [1, 1], [1, 2]];  // Left

// Z & S Shapes: Zig-zag combinations of 4 blocks (horizontal and vertical variations)
const PIECE_S_H = [[1, 0], [2, 0], [0, 1], [1, 1]]; // S Horizontal
const PIECE_S_V = [[0, 0], [0, 1], [1, 1], [1, 2]]; // S Vertical
const PIECE_Z_H = [[0, 0], [1, 0], [1, 1], [2, 1]]; // Z Horizontal
const PIECE_Z_V = [[1, 0], [0, 1], [1, 1], [0, 2]]; // Z Vertical

// Corner Steps / Stairs: 6-block stair-step pattern (4 corner orientations)
const PIECE_STAIR_TL = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [0, 2]]; // Top-Left corner stairs
const PIECE_STAIR_TR = [[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [2, 2]]; // Top-Right corner stairs
const PIECE_STAIR_BL = [[0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Left corner stairs
const PIECE_STAIR_BR = [[2, 0], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]; // Bottom-Right corner stairs

// Master shape definition pool
const shape_def = [
  // 1. Single Cubes & Squares
  PIECE_DOT_1X1,
  PIECE_O,
  PIECE_SQUARE_3X3,

  // 2. Lines & Bars
  PIECE_DOMINO_H,
  PIECE_DOMINO_V,
  PIECE_TRIO_LINE_H,
  PIECE_TRIO_LINE_V,
  PIECE_I_H,
  PIECE_I_V,
  PIECE_LINE_5_H,
  PIECE_LINE_5_V,

  // 3. L-Shapes & Hooks
  PIECE_TRIO_CORNER_BL,
  PIECE_TRIO_CORNER_BR,
  PIECE_TRIO_CORNER_TL,
  PIECE_TRIO_CORNER_TR,
  PIECE_J_0,
  PIECE_J_90,
  PIECE_J_180,
  PIECE_J_270,
  PIECE_L_0,
  PIECE_L_90,
  PIECE_L_180,
  PIECE_L_270,
  PIECE_BIG_CORNER_TL,
  PIECE_BIG_CORNER_TR,
  PIECE_BIG_CORNER_BL,
  PIECE_BIG_CORNER_BR,

  // 4. T-Shapes, Steps, and Z-Shapes
  PIECE_T_DOWN,
  PIECE_T_UP,
  PIECE_T_RIGHT,
  PIECE_T_LEFT,
  PIECE_S_H,
  PIECE_S_V,
  PIECE_Z_H,
  PIECE_Z_V,
  PIECE_STAIR_TL,
  PIECE_STAIR_TR,
  PIECE_STAIR_BL,
  PIECE_STAIR_BR
];

// Categorized tiers for smart, balanced rack generation
const SMALL_SHAPES = [
  PIECE_DOT_1X1,
  PIECE_DOMINO_H,
  PIECE_DOMINO_V,
  PIECE_TRIO_LINE_H,
  PIECE_TRIO_LINE_V,
  PIECE_TRIO_CORNER_BL,
  PIECE_TRIO_CORNER_BR,
  PIECE_TRIO_CORNER_TL,
  PIECE_TRIO_CORNER_TR
];

const MEDIUM_SHAPES = [
  PIECE_O,
  PIECE_I_H,
  PIECE_I_V,
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
  PIECE_L_270
];

const LARGE_SHAPES = [
  PIECE_LINE_5_H,
  PIECE_LINE_5_V,
  PIECE_BIG_CORNER_TL,
  PIECE_BIG_CORNER_TR,
  PIECE_BIG_CORNER_BL,
  PIECE_BIG_CORNER_BR,
  PIECE_STAIR_TL,
  PIECE_STAIR_TR,
  PIECE_STAIR_BL,
  PIECE_STAIR_BR,
  PIECE_SQUARE_3X3
];

let pieceSeq = 1;

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPiece(cells) {
  return {
    id: 'pc_' + (pieceSeq++),
    cells: cells
  };
}

/**
 * Check if a shape fits anywhere on the 8x8 grid
 */
function shapeFits(grid, shape) {
  if (!grid) return true;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let fits = true;
      for (let i = 0; i < shape.length; i++) {
        const nx = x + shape[i][0];
        const ny = y + shape[i][1];
        if (nx >= 8 || ny >= 8 || grid[ny][nx] !== 0) {
          fits = false;
          break;
        }
      }
      if (fits) return true;
    }
  }
  return false;
}

/**
 * Find all valid placements for a shape on grid, and calculate how many lines each placement clears
 */
function getValidPlacements(grid, shape) {
  const validPlacements = [];
  if (!grid) return validPlacements;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let fits = true;
      for (let i = 0; i < shape.length; i++) {
        const nx = x + shape[i][0];
        const ny = y + shape[i][1];
        if (nx >= 8 || ny >= 8 || grid[ny][nx] !== 0) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;

      // Count full rows and columns if this shape were placed here
      const affectedRows = new Set();
      const affectedCols = new Set();
      for (let i = 0; i < shape.length; i++) {
        affectedRows.add(y + shape[i][1]);
        affectedCols.add(x + shape[i][0]);
      }

      let lines = 0;
      for (const r of affectedRows) {
        let full = true;
        for (let c = 0; c < 8; c++) {
          if (grid[r][c] === 0) {
            let filledByShape = false;
            for (let i = 0; i < shape.length; i++) {
              if (x + shape[i][0] === c && y + shape[i][1] === r) {
                filledByShape = true;
                break;
              }
            }
            if (!filledByShape) {
              full = false;
              break;
            }
          }
        }
        if (full) lines++;
      }

      for (const c of affectedCols) {
        let full = true;
        for (let r = 0; r < 8; r++) {
          if (grid[r][c] === 0) {
            let filledByShape = false;
            for (let i = 0; i < shape.length; i++) {
              if (x + shape[i][0] === c && y + shape[i][1] === r) {
                filledByShape = true;
                break;
              }
            }
            if (!filledByShape) {
              full = false;
              break;
            }
          }
        }
        if (full) lines++;
      }

      validPlacements.push({ x, y, lines });
    }
  }
  return validPlacements;
}

/**
 * Simulate placing a shape at (x, y) on grid, clearing completed lines, and returning the new grid
 */
function simulatePlacement(grid, shape, x, y) {
  const nextGrid = grid.map((r) => [...r]);
  for (let i = 0; i < shape.length; i++) {
    nextGrid[y + shape[i][1]][x + shape[i][0]] = 1;
  }
  const fullRows = [];
  const fullCols = [];
  for (let r = 0; r < 8; r++) {
    if (nextGrid[r].every((v) => v === 1)) fullRows.push(r);
  }
  for (let c = 0; c < 8; c++) {
    let colFull = true;
    for (let r = 0; r < 8; r++) {
      if (nextGrid[r][c] === 0) {
        colFull = false;
        break;
      }
    }
    if (colFull) fullCols.push(c);
  }
  for (const r of fullRows) {
    for (let c = 0; c < 8; c++) nextGrid[r][c] = 0;
  }
  for (const c of fullCols) {
    for (let r = 0; r < 8; r++) nextGrid[r][c] = 0;
  }
  return nextGrid;
}

/**
 * Pick best placement that maximizes line clears (or leaves most space)
 */
function findBestPlacement(grid, shape) {
  const placements = getValidPlacements(grid, shape);
  if (placements.length === 0) return null;
  let best = placements[0];
  for (const p of placements) {
    if (p.lines > best.lines) {
      best = p;
    }
  }
  return best;
}

/**
 * Base weights: Small, flexible pieces appear most often; massive pieces appear rarely.
 */
function getShapeBaseWeight(shape) {
  const size = shape.length;
  // The Dot (1x1): Essential savior piece, highly flexible
  if (size === 1) return 18;
  // 2-Block Bars: Very frequent, easy to fit
  if (size === 2) return 14;
  // 3-Block pieces (3-bars and small corners)
  if (size === 3) return 10;
  // 4-Block standard tetrominoes (O, I, T, L, J)
  if (size === 4) {
    const isZorS = (
      shape === PIECE_S_H || shape === PIECE_S_V ||
      shape === PIECE_Z_H || shape === PIECE_Z_V
    );
    return isZorS ? 3 : 6;
  }
  // 5-Block pieces (5-bars, Giant L)
  if (size === 5) return 1.5;
  // 6-Block stairs
  if (size === 6) return 1.0;
  // 3x3 Giant Square (9 blocks): Very rare!
  if (size === 9) return 0.5;
  return 5;
}

/**
 * Dynamic weighting based on real board conditions:
 * - Massively boosts shapes that can clear rows or columns (Combo / Blast Engine)
 * - Zeroes out massive pieces if the board is crowded
 * - Heavily boosts dots and dominoes in tight spots
 */
function getShapeWeight(grid, shape, fullness, largePiecesInRack) {
  const placements = getValidPlacements(grid, shape);
  if (placements.length === 0) return 0;

  const size = shape.length;
  const isLarge = size >= 5;

  // Max 1 large piece per rack
  if (isLarge && largePiecesInRack >= 1) return 0;

  // If board is more than 28% full, no large pieces allowed
  if (isLarge && fullness > 0.28) return 0;

  // 3x3 Giant square only allowed on a very open board (< 20% full)
  if (size === 9 && fullness > 0.20) return 0;

  let weight = getShapeBaseWeight(shape);

  // LINE CLEAR ENGINE: If this shape can clear lines, boost it massively!
  const maxLines = placements.reduce((max, p) => Math.max(max, p.lines), 0);
  if (maxLines > 0) {
    weight *= (maxLines >= 2 ? 5.0 : 3.5);
  }

  // Crowded board adjustment: When danger rises, prioritize small lifelines
  if (fullness > 0.38) {
    if (size === 1) weight *= 3.0; // Boost 1x1 dot
    else if (size === 2) weight *= 2.2; // Boost dominoes
    else if (size === 3) weight *= 1.6; // Boost 3-bars / corners
    else if (size === 4) weight *= 0.6; // Reduce 4-blocks
  }

  return weight;
}

/**
 * Weighted random shape selection
 */
function pickWeightedShape(grid, candidateShapes, fullness, largeCount) {
  const weightedCandidates = [];
  let totalWeight = 0;

  for (const shape of candidateShapes) {
    const w = getShapeWeight(grid, shape, fullness, largeCount);
    if (w > 0) {
      weightedCandidates.push({ shape, weight: w });
      totalWeight += w;
    }
  }

  if (weightedCandidates.length === 0 || totalWeight === 0) {
    const fitting = candidateShapes.filter((s) => shapeFits(grid, s));
    if (fitting.length > 0) return getRandomItem(fitting);
    return null;
  }

  let roll = Math.random() * totalWeight;
  for (const item of weightedCandidates) {
    roll -= item.weight;
    if (roll <= 0) return item.shape;
  }
  return weightedCandidates[weightedCandidates.length - 1].shape;
}

/**
 * Generate a single random polyomino piece
 */
function generatePiece(shapeList = shape_def) {
  const list = (shapeList && shapeList.length > 0) ? shapeList : shape_def;
  return createPiece(getRandomItem(list));
}

/**
 * Emergency savior piece generator:
 * Guarantees a piece that can fit and ideally clear a line on grid
 */
function getPlayableSaviorPiece(grid) {
  if (!grid) return createPiece(PIECE_DOT_1X1);

  // 1. Try to find a small shape that clears at least one line
  for (const shape of SMALL_SHAPES) {
    const placements = getValidPlacements(grid, shape);
    if (placements.some((p) => p.lines > 0)) {
      return createPiece(shape);
    }
  }

  // 2. Try any small shape that fits
  const fittingSmall = SMALL_SHAPES.filter((s) => shapeFits(grid, s));
  if (fittingSmall.length > 0) {
    return createPiece(getRandomItem(fittingSmall));
  }

  // 3. Try any shape from shape_def that fits
  const fittingAny = shape_def.filter((s) => shapeFits(grid, s));
  if (fittingAny.length > 0) {
    return createPiece(getRandomItem(fittingAny));
  }

  // 4. Default to 1x1 dot
  return createPiece(PIECE_DOT_1X1);
}

/**
 * Generate a rack of 3 balanced, sequentially-solvable pieces.
 * Emulates real Block Blast's adaptive, combo-friendly piece generator:
 * - Simulates sequential playability (Piece 1 -> Piece 2 -> Piece 3)
 * - Actively detects nearly-completed lines and delivers blast/clearing pieces
 * - Generous weighting towards dots, dominoes, and small corners
 * - Prevents awkward flooding and gives players every chance to survive and combo
 */
function generateRack(grid = null) {
  // If no grid provided, create a standard balanced starting rack
  if (!grid) {
    const emptyGrid = Array(8).fill(null).map(() => Array(8).fill(0));
    return generateRack(emptyGrid);
  }

  // Calculate current board occupancy
  let totalOccupied = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c] !== 0) totalOccupied++;
    }
  }
  const fullness = totalOccupied / 64;

  const rack = [];
  let currentGrid = grid;
  let largeCount = 0;

  for (let slot = 0; slot < 3; slot++) {
    let chosenShape = pickWeightedShape(currentGrid, shape_def, fullness, largeCount);

    // If no shape could fit on simulated intermediate grid, pick from shapes fitting original grid
    if (!chosenShape) {
      chosenShape = pickWeightedShape(grid, shape_def, fullness, largeCount);
    }

    // Fallback to smallest fitting shape or 1x1 dot
    if (!chosenShape) {
      const fitting = shape_def.filter((s) => shapeFits(grid, s));
      chosenShape = fitting.length > 0 ? fitting[0] : PIECE_DOT_1X1;
    }

    if (chosenShape.length >= 5) largeCount++;
    rack.push(createPiece(chosenShape));

    // Advance simulated grid to test next slot's solvability
    const bestPlacement = findBestPlacement(currentGrid, chosenShape);
    if (bestPlacement) {
      currentGrid = simulatePlacement(currentGrid, chosenShape, bestPlacement.x, bestPlacement.y);
    }
  }

  // Strict survival guarantee: rack must have at least one valid move on grid
  if (!canFitAnywhere(grid, rack)) {
    rack[0] = getPlayableSaviorPiece(grid);
  }

  return rack;
}

/**
 * Check if any piece in the rack can fit anywhere on the 8x8 grid
 */
function canFitAnywhere(grid, rack) {
  if (!grid || !rack || rack.length === 0) return true;
  for (const piece of rack) {
    if (shapeFits(grid, piece.cells)) return true;
  }
  return false;
}

module.exports = {
  shape_def,
  SHAPE_DEFINITIONS: shape_def,
  SMALL_SHAPES,
  MEDIUM_SHAPES,
  LARGE_SHAPES,
  shapeFits,
  getValidPlacements,
  simulatePlacement,
  getPlayableSaviorPiece,
  generatePiece,
  generateRack,
  canFitAnywhere
};
