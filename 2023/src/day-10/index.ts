import { readFileSync } from 'node:fs';

type Dir = 'e' | 'n' | 's' | 'w';

const DIRS: Record<Dir, number[]> = {
  e: [0, 1],
  n: [-1, 0],
  s: [1, 0],
  w: [0, -1],
};

const PIPES: Record<string, Partial<Record<Dir, Dir>>> = {
  '|': {
    n: 'n',
    s: 's',
  },
  '-': {
    e: 'e',
    w: 'w',
  },
  L: {
    s: 'e',
    w: 'n',
  },
  J: {
    e: 'n',
    s: 'w',
  },
  '7': {
    e: 's',
    n: 'w',
  },
  F: {
    n: 'e',
    w: 's',
  },
};

function getFarthestPoint(grid: string[][]): number {
  const [height, width] = [grid.length, grid[0].length];
  const memo = Array(height)
    .fill(0)
    .map(() => Array(width).fill(-1));
  const queue: [number, number, Dir[]][] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') {
        queue.push([y, x, ['e', 'n', 's', 'w']]);
      }
    }
  }

  memo[queue[0][0]][queue[0][1]] = 0;

  while (queue.length) {
    const [startY, startX, dirs] = queue.shift()!;
    for (const dir of dirs) {
      const [modY, modX] = DIRS[dir];
      const [y, x] = [startY + modY, startX + modX];
      if (isOutOfBounds(height, width, y, x)) continue;
      const move = PIPES[grid[y][x]]?.[dir];
      if (!move) continue;

      const prevDist = memo[y][x];
      const candidateDist = 1 + memo[startY][startX];
      memo[y][x] =
        prevDist === -1 ? candidateDist : Math.min(prevDist, candidateDist);

      queue.push([y, x, [move]]);
    }
  }

  return Math.max(...memo.flat().flat());
}

function getEnclosedTiles(grid: string[][]): number {
  const [height, width] = [grid.length, grid[0].length];
  const memo = Array(height)
    .fill(0)
    .map(() => Array(width).fill('?'));
  const queue: [number, number, Dir[]][] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') {
        queue.push([y, x, ['e', 'n', 's', 'w']]);
      }
    }
  }

  memo[queue[0][0]][queue[0][1]] = 'S';

  while (queue.length) {
    const [startY, startX, dirs] = queue.pop()!;
    for (const dir of dirs) {
      const [modY, modX] = DIRS[dir];
      const [y, x] = [startY + modY, startX + modX];
      if (isOutOfBounds(height, width, y, x)) continue;
      const move = PIPES[grid[y][x]]?.[dir];
      if (!move) continue;

      memo[y][x] = grid[y][x];
      queue.push([y, x, [move]]);
      break;
    }
  }

  flood(memo);
  const expanded = expand(memo);
  flood(expanded);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = memo[y][x];
      if (cell !== '@') continue;
      if (expanded[y * 3][x * 3] === '@') continue;
      memo[y][x] = '.';
    }
  }

  return memo
    .flat()
    .flat()
    .reduce((acc, curr) => acc + (curr === '@' ? 1 : 0), 0);
}

function expand(original: string[][]): string[][] {
  const [height, width] = [original.length, original[0].length];
  const grid = Array(height * 3)
    .fill(0)
    .map(() => Array(width * 3).fill('?'));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = original[y][x];
      if (cell === '.') continue;

      const fills: number[] = [];
      if (cell === 'S') fills.push(1, 3, 4, 5, 7);
      else if (cell === '|') fills.push(1, 4, 7);
      else if (cell === '-') fills.push(3, 4, 5);
      else if (cell === 'L') fills.push(1, 4, 5);
      else if (cell === 'J') fills.push(1, 3, 4);
      else if (cell === '7') fills.push(3, 4, 7);
      else if (cell === 'F') fills.push(4, 5, 7);
      for (const fill of fills) {
        grid[y * 3 + Math.floor(fill / 3)][x * 3 + (fill % 3)] = 'x';
      }
    }
  }
  return grid;
}

function flood(memo: string[][]): void {
  const [height, width] = [memo.length, memo[0].length];
  for (let y = 0; y < height; y++) {
    if (memo[y][0] === '?') dfsFill([y, 0], memo, '.');
    if (memo[y][width - 1] === '?') dfsFill([y, width - 1], memo, '.');
  }

  for (let x = 0; x < width; x++) {
    if (memo[0][x] === '?') dfsFill([0, x], memo, '.');
    if (memo[height - 1][x] === '?') dfsFill([height - 1, x], memo, '.');
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (memo[y][x] !== '?') continue;
      dfsFill([y, x], memo, '@');
    }
  }
}

function dfsFill(start: number[], memo: string[][], fill: string): void {
  const [height, width] = [memo.length, memo[0].length];
  const stack = [start];

  while (stack.length) {
    const [startY, startX] = stack.pop()!;
    memo[startY][startX] = fill;

    for (const [modY, modX] of Object.values(DIRS)) {
      const [y, x] = [startY + modY, startX + modX];
      if (isOutOfBounds(height, width, y, x)) continue;
      if (memo[y][x] !== '?') continue;

      stack.push([y, x]);
    }
  }
}

function isOutOfBounds(height: number, width: number, y: number, x: number) {
  return y < 0 || y >= height || x < 0 || x >= width;
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

const example1 = parseFile('./src/day-10/example1.txt');
const example2 = parseFile('./src/day-10/example2.txt');
const example3 = parseFile('./src/day-10/example3.txt');
const example4 = parseFile('./src/day-10/example4.txt');
const example5 = parseFile('./src/day-10/example5.txt');
const example6 = parseFile('./src/day-10/example6.txt');
const puzzle = parseFile('./src/day-10/puzzle.txt');

timeExecutionMs(() => console.log(getFarthestPoint(example1)));
timeExecutionMs(() => console.log(getFarthestPoint(example2)));
timeExecutionMs(() => console.log(getFarthestPoint(puzzle)));

timeExecutionMs(() => console.log(getEnclosedTiles(example3)));
timeExecutionMs(() => console.log(getEnclosedTiles(example4)));
timeExecutionMs(() => console.log(getEnclosedTiles(example5)));
timeExecutionMs(() => console.log(getEnclosedTiles(example6)));
timeExecutionMs(() => console.log(getEnclosedTiles(puzzle)));
