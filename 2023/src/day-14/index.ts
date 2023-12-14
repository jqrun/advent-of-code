import { readFileSync } from 'node:fs';

function calcLoadAfterSpins(gridToTilt: string[][]): number {
  const [height, width] = [gridToTilt.length, gridToTilt[0].length];
  const seen = new Set<string>();
  let grid = gridToTilt;
  let spins = 0;
  let firstLoopKey = '';
  let firstLoop = 0;
  let secondLoop = 0;

  while (true) {
    const key = JSON.stringify(grid);
    if (key === firstLoopKey) {
      secondLoop = spins;
      break;
    } else if (!firstLoop && seen.has(key)) {
      firstLoop = spins;
      firstLoopKey = key;
    }

    seen.add(key);
    grid = spin(grid);
    spins++;
  }

  const cycleLen = secondLoop - firstLoop;
  const remaining = (1_000_000_000 - secondLoop) % cycleLen;
  for (let i = 0; i < remaining; i++) grid = spin(grid);

  let total = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'O') total += height - y;
    }
  }

  return total;
}

function calcLoad(gridToTilt: string[][]): number {
  const grid = tiltNorth(gridToTilt);
  const [height, width] = [grid.length, grid[0].length];
  let total = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'O') total += height - y;
    }
  }

  return total;
}

const spin = (gridToSpin: string[][]): string[][] => {
  return tiltEast(tiltSouth(tiltWest(tiltNorth(gridToSpin))));
};

function tiltNorth(gridToTilt: string[][]): string[][] {
  const grid = gridToTilt.slice(0).map((x) => x.slice(0));
  const [height, width] = [grid.length, grid[0].length];
  const stops: number[] = grid[0].map((x) => (x === '.' ? 0 : 1));

  for (let y = 1; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      if (cell === '#') {
        stops[x] = y + 1;
      } else if (cell === 'O') {
        grid[y][x] = '.';
        grid[stops[x]][x] = 'O';
        stops[x]++;
      }
    }
  }

  return grid;
}

function tiltSouth(gridToTilt: string[][]): string[][] {
  const grid = gridToTilt.slice(0).map((x) => x.slice(0));
  const [height, width] = [grid.length, grid[0].length];
  const stops: number[] = grid[height - 1].map((x) =>
    x === '.' ? height - 1 : height - 2,
  );

  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      if (cell === '#') {
        stops[x] = y - 1;
      } else if (cell === 'O') {
        grid[y][x] = '.';
        grid[stops[x]][x] = 'O';
        stops[x]--;
      }
    }
  }

  return grid;
}

function tiltEast(gridToTilt: string[][]): string[][] {
  const grid = gridToTilt.slice(0).map((x) => x.slice(0));
  const [height, width] = [grid.length, grid[0].length];
  const stops: number[] = [...Array(height).keys()].map((y) =>
    grid[y][width - 1] === '.' ? width - 1 : width - 2,
  );

  for (let x = width - 2; x >= 0; x--) {
    for (let y = 0; y < height; y++) {
      const cell = grid[y][x];
      if (cell === '#') {
        stops[y] = x - 1;
      } else if (cell === 'O') {
        grid[y][x] = '.';
        grid[y][stops[y]] = 'O';
        stops[y]--;
      }
    }
  }

  return grid;
}

function tiltWest(gridToTilt: string[][]): string[][] {
  const grid = gridToTilt.slice(0).map((x) => x.slice(0));
  const [height, width] = [grid.length, grid[0].length];
  const stops: number[] = [...Array(height).keys()].map((y) =>
    grid[y][0] === '.' ? 0 : 1,
  );

  for (let x = 1; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cell = grid[y][x];
      if (cell === '#') {
        stops[y] = x + 1;
      } else if (cell === 'O') {
        grid[y][x] = '.';
        grid[y][stops[y]] = 'O';
        stops[y]++;
      }
    }
  }

  return grid;
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

const example = parseFile('./src/day-14/example.txt');
const puzzle = parseFile('./src/day-14/puzzle.txt');

timeExecutionMs(() => console.log(calcLoad(example)));
timeExecutionMs(() => console.log(calcLoad(puzzle)));

timeExecutionMs(() => console.log(calcLoadAfterSpins(example)));
timeExecutionMs(() => console.log(calcLoadAfterSpins(puzzle)));
