import { readFileSync } from 'node:fs';

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function getCountInInfiniteGrid(grid: string[][], steps: number): number {
  const halfway = Math.floor(grid.length / 2);
  const n = (steps - halfway) / grid.length;
  const evenCorners = getPlotCountAfterSteps(grid, 99999, 0, halfway);
  const oddCorners = getPlotCountAfterSteps(grid, 99999, 1, halfway);
  const evenGrid = getPlotCountAfterSteps(grid, 99999, 0);
  const oddGrid = getPlotCountAfterSteps(grid, 99999, 1);

  // Diff between brute force and this method appeared to be 334 every 2n, with a base of 84.
  const adjustment = 84 + (n / 2) * 334;

  return (
    (n + 1) * (n + 1) * oddGrid +
    n * n * evenGrid -
    (n + 1) * oddCorners +
    n * evenCorners +
    adjustment
  );
}

function expand(grid: string[][], times = 3): string[][] {
  const start = findStart(grid);
  const copy: string[][] = JSON.parse(JSON.stringify(grid));
  copy[start[0]][start[1]] = '.';
  const height = grid.length;
  const newGrid: string[][] = [];

  for (let i = 0; i < times; i++) {
    for (let j = 0; j < height; j++) {
      const row: string[] = [];
      for (let k = 0; k < times; k++) {
        row.push(...copy[j]);
      }
      newGrid.push(row);
    }
  }

  const shifted = Math.floor(times / 2) * height;
  newGrid[start[0] + shifted][start[1] + shifted] = 'S';
  return newGrid;
}

function getPlotCountAfterSteps(
  grid: string[][],
  steps: number,
  parity = 0,
  afterSteps = -1,
): number {
  const [height, width] = [grid.length, grid[0].length];
  const start = findStart(grid);
  const visited = new Set<string>();
  let stepsMut = steps;
  let queue = [start];
  let plots = 0;

  while (stepsMut-- && queue.length) {
    const nextQueue = [];

    for (const point of queue) {
      for (const [dy, dx] of DIRS) {
        const [y, x] = [point[0] + dy, point[1] + dx];
        if (y < 0 || y >= height || x < 0 || x >= width) continue;
        if (grid[y][x] === '#') continue;
        const key = JSON.stringify([y, x]);
        if (visited.has(key)) continue;
        visited.add(key);
        nextQueue.push([y, x]);
        const bfsSteps = steps - stepsMut;
        if (stepsMut % 2 === parity && bfsSteps > afterSteps) plots++;
      }
    }
    queue = nextQueue;
  }

  return plots;
}

function findStart(grid: string[][]): number[] {
  const [height, width] = [grid.length, grid[0].length];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') return [y, x];
    }
  }
  return [];
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

const example = parseFile('./src/day-21/example.txt');
const puzzle = parseFile('./src/day-21/puzzle.txt');

timeExecutionMs(() => console.log(getPlotCountAfterSteps(example, 6)));
timeExecutionMs(() => console.log(getPlotCountAfterSteps(puzzle, 64)));

timeExecutionMs(() =>
  console.log(getPlotCountAfterSteps(expand(puzzle, 5), 327)),
);
timeExecutionMs(() => console.log(getCountInInfiniteGrid(puzzle, 327))); // -418

timeExecutionMs(() =>
  console.log(getPlotCountAfterSteps(expand(puzzle, 9), 589)),
);
timeExecutionMs(() => console.log(getCountInInfiniteGrid(puzzle, 589))); // -752

timeExecutionMs(() =>
  console.log(getPlotCountAfterSteps(expand(puzzle, 13), 851)),
);
timeExecutionMs(() => console.log(getCountInInfiniteGrid(puzzle, 851))); // -1,086

timeExecutionMs(() => console.log(getCountInInfiniteGrid(puzzle, 26501365)));
