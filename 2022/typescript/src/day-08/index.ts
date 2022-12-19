import { readFileSync } from 'node:fs';

type Direction = 'north' | 'east' | 'south' | 'west';

interface DirectionDetails {
  tallest: number;
  isVisible: boolean;
}

interface Tree {
  height: number;
  directions: Record<Direction, DirectionDetails>;
}

const DIR_MODIFIERS: Record<Direction, [number, number]> = {
  north: [-1, 0],
  east: [0, 1],
  south: [1, 0],
  west: [0, -1],
};

function getMostScenic(grid: Tree[][]): number {
  const [rows, cols] = [grid.length, grid[0].length];
  let mostScenic = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let scenicVal = 1;

      for (const [rowMod, colMod] of Object.values(DIR_MODIFIERS)) {
        let i = row + rowMod;
        let j = col + colMod;
        let treesVisible = 0;

        while (i >= 0 && j >= 0 && i < rows && j < cols) {
          treesVisible++;
          if (grid[i][j].height >= grid[row][col].height) break;

          i += rowMod;
          j += colMod;
        }

        scenicVal *= treesVisible;
      }

      mostScenic = Math.max(mostScenic, scenicVal);
    }
  }

  return mostScenic;
}

function getNumVisible(grid: Tree[][]): number {
  let count = 0;

  for (const row of grid) {
    for (const tree of row) {
      if (
        Object.values(tree.directions)
          .map((x) => x.isVisible)
          .some(Boolean)
      ) {
        count++;
      }
    }
  }

  return count;
}

function parseFile(path: string): Tree[][] {
  const grid: Tree[][] = readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) =>
      x
        .split('')
        .map(Number)
        .map((height) => {
          const defaultDir: DirectionDetails = {
            tallest: height,
            isVisible: false,
          };

          return {
            height,
            directions: {
              north: { ...defaultDir },
              east: { ...defaultDir },
              south: { ...defaultDir },
              west: { ...defaultDir },
            },
          };
        })
    );

  updateVisibility(grid);
  return grid;
}

function updateVisibility(grid: Tree[][]): void {
  const [rows, cols] = [grid.length, grid[0].length];

  const setDirectionDetails = (
    row: number,
    col: number,
    dir: Direction
  ): void => {
    const isEdge =
      (dir === 'north' && row === 0) ||
      (dir === 'east' && col === cols - 1) ||
      (dir === 'south' && row === rows - 1) ||
      (dir === 'west' && col === 0);

    if (isEdge) {
      grid[row][col].directions[dir].isVisible = true;
      return;
    }

    const [rowMod, colMod] = DIR_MODIFIERS[dir];
    const curr = grid[row][col];
    const prev = grid[row + rowMod][col + colMod];

    if (curr.height > prev.directions[dir].tallest) {
      curr.directions[dir].isVisible = true;
      curr.directions[dir].tallest = curr.height;
    } else {
      curr.directions[dir] = { ...prev.directions[dir], isVisible: false };
    }
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      setDirectionDetails(row, col, 'west');
    }

    for (let col = cols - 1; col >= 0; col--) {
      setDirectionDetails(row, col, 'east');
    }
  }

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      setDirectionDetails(row, col, 'north');
    }

    for (let row = rows - 1; row >= 0; row--) {
      setDirectionDetails(row, col, 'south');
    }
  }
}

const exampleInput = parseFile('./src/day-08/example.txt');
const puzzleInput = parseFile('./src/day-08/puzzle.txt');

console.log(getNumVisible(exampleInput));
console.log(getNumVisible(puzzleInput));

console.log(getMostScenic(exampleInput));
console.log(getMostScenic(puzzleInput));
