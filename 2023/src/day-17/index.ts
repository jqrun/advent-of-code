import { readFileSync } from 'node:fs';

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function minimizeHeatLoss(
  grid: number[][],
  minMoves = 0,
  maxMoves = 3,
): number {
  const [height, width] = [grid.length, grid[0].length];
  const seen: Record<string, number[]> = {};
  let minCost = Number.POSITIVE_INFINITY;
  let queue: number[][] = [
    // startY, startX, deltaY, deltaX, count, cost
    [0, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 1, 0],
  ];

  while (queue.length) {
    const nextQueue: number[][] = [];
    for (const [sy, sx, dy, dx, count, prevCost] of queue) {
      const [y, x] = [sy + dy, sx + dx];
      // Skip consecutive movement limits
      if (count > maxMoves) continue;
      // Skip out of bounds
      if (y < 0 || y >= height || x < 0 || x >= width) continue;
      const cost = prevCost + grid[y][x];
      const key = encode(sy, sx, dy, dx, count);
      // Skip path if already seen with lower or equal cost
      if (seen[key] && seen[key][0] >= count && seen[key][1] <= cost) continue;
      seen[key] = [count, cost];

      // Finished searching
      if (y === height - 1 && x === width - 1 && count >= minMoves) {
        minCost = Math.min(minCost, cost);
        continue;
      }

      // Else continue searching
      for (const [ddy, ddx] of DIRS) {
        // Skip reverse direction
        if (ddy === -dy && ddx === -dx) continue;
        const isSameDir = ddy === dy && ddx === dx;
        // Skip other directions if min count not met
        if (count < minMoves && !isSameDir) continue;
        const newCount = isSameDir ? count + 1 : 1;
        nextQueue.push([y, x, ddy, ddx, newCount, cost]);
      }
    }
    queue = nextQueue;
  }

  return minCost;
}

function encode(...args: number[]): string {
  return args.join(',');
}

function parseFile(path: string): number[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split('').map(Number));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-17/example.txt');
const example2 = parseFile('./src/day-17/example2.txt');
const puzzle = parseFile('./src/day-17/puzzle.txt');

timeExecutionMs(() => console.log(minimizeHeatLoss(example)));
timeExecutionMs(() => console.log(minimizeHeatLoss(puzzle)));

timeExecutionMs(() => console.log(minimizeHeatLoss(example, 4, 10)));
timeExecutionMs(() => console.log(minimizeHeatLoss(example2, 4, 10)));
timeExecutionMs(() => console.log(minimizeHeatLoss(puzzle, 4, 10)));
