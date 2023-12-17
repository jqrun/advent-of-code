import { readFileSync } from 'node:fs';

function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  const memo: Record<string, Result> = {};

  return (...args) => {
    const key = JSON.stringify(args);
    if (memo[key]) return memo[key];
    const result = fn(...args);
    memo[key] = result;
    return result;
  };
}

function getOptimalEnergized(grid: string[][]): number {
  const countMemoized = memoize(countEnergized);
  const [height, width] = [grid.length, grid[0].length];
  let max = 0;

  for (let y = 0; y < height; y++) {
    max = Math.max(max, countMemoized(grid, [y, -1, 0, 1]));
    max = Math.max(max, countMemoized(grid, [y, width, 0, -1]));
  }

  for (let x = 0; x < width; x++) {
    max = Math.max(max, countMemoized(grid, [-1, x, 1, 0]));
    max = Math.max(max, countMemoized(grid, [height, x, -1, 0]));
  }

  return max;
}

function countEnergized(grid: string[][], start = [0, -1, 0, 1]): number {
  const [height, width] = [grid.length, grid[0].length];
  const energized = new Set<string>();
  const seen = new Set<string>();
  let beams: number[][] = [start];

  while (beams.length) {
    const nextBeams: number[][] = [];
    for (const [sy, sx, dy, dx] of beams) {
      const seenKey = encode(sy, sx, dy, dx);
      if (seen.has(seenKey)) continue;
      seen.add(seenKey);

      const [y, x] = [sy + dy, sx + dx];
      if (y < 0 || y >= height || x < 0 || x >= width) continue;
      const cell = grid[y][x];
      energized.add(encode(y, x));

      if (cell === '.' || (cell === '|' && !dx) || (cell === '-' && !dy)) {
        nextBeams.push([y, x, dy, dx]);
      } else if (cell === '|') {
        nextBeams.push([y, x, 1, 0], [y, x, -1, 0]);
      } else if (cell === '-') {
        nextBeams.push([y, x, 0, 1], [y, x, 0, -1]);
      } else if (cell === '/') {
        nextBeams.push([y, x, -dx, -dy]);
      } else if (cell === '\\') {
        nextBeams.push([y, x, dx, dy]);
      }
    }
    beams = nextBeams;
  }

  return energized.size;
}

function encode(...args: number[]): string {
  return args.join('-');
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

const example = parseFile('./src/day-16/example.txt');
const puzzle = parseFile('./src/day-16/puzzle.txt');

timeExecutionMs(() => console.log(countEnergized(example)));
timeExecutionMs(() => console.log(countEnergized(puzzle)));

timeExecutionMs(() => console.log(getOptimalEnergized(example)));
timeExecutionMs(() => console.log(getOptimalEnergized(puzzle)));
