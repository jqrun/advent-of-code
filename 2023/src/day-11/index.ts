import { readFileSync } from 'node:fs';

function sumShortestPaths(grid: string[][], expansion = 1): number {
  const [height, width] = [grid.length, grid[0].length];
  const galaxies: number[][] = [];
  const expRows = new Set([...Array(height).keys()]);
  const expCols = new Set([...Array(width).keys()]);
  let sum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] !== '#') continue;
      galaxies.push([y, x]);
      expRows.delete(y);
      expCols.delete(x);
    }
  }

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [a, b] = [galaxies[i], galaxies[j]];
      const yRange = [a[0], b[0]].toSorted((a, b) => a - b);
      const xRange = [a[1], b[1]].toSorted((a, b) => a - b);
      let yDelta = yRange[1] - yRange[0];
      let xDelta = xRange[1] - xRange[0];
      for (const row of expRows) {
        if (row <= yRange[0] || row >= yRange[1]) continue;
        yDelta += expansion;
      }
      for (const col of expCols) {
        if (col <= xRange[0] || col >= xRange[1]) continue;
        xDelta += expansion;
      }
      sum += yDelta + xDelta;
    }
  }

  return sum;
}

function parseFile(path: string): string[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(''));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-11/example.txt');
const puzzle = parseFile('./src/day-11/puzzle.txt');

timeExecutionMs(() => console.log(sumShortestPaths(example)));
timeExecutionMs(() => console.log(sumShortestPaths(puzzle)));

timeExecutionMs(() => console.log(sumShortestPaths(example, 999_999)));
timeExecutionMs(() => console.log(sumShortestPaths(puzzle, 999_999)));
