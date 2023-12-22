import { readFileSync } from 'node:fs';

type Brick = number[][];

function getNumFallen(bricks: Brick[]): number {
  const { supportedBy, supports, removable } = simulateFall(bricks);

  const falls: Set<number>[] = [...Array(bricks.length)].map(() => new Set());
  for (let i = 0; i < bricks.length; i++) {
    if (removable.has(i)) continue;

    const cascaded = new Set<number>([i]);
    let queue = [i];

    while (queue.length) {
      const nextQueue = [];
      for (const fallen of queue) {
        for (const brick of [...(supports[fallen] ?? [])]) {
          const supports = [...(supportedBy[brick] ?? [])];
          if (!supports.every((x) => cascaded.has(x))) continue;
          cascaded.add(brick);
          nextQueue.push(brick);
        }
      }
      queue = [...new Set(nextQueue)];
    }
    cascaded.delete(i);
    falls[i] = cascaded;
  }
  return falls.reduce((acc, curr) => acc + curr.size, 0);
}

function getNumRemovable(bricks: Brick[]): number {
  const { removable } = simulateFall(bricks);
  return removable.size;
}

function simulateFall(bricks: Brick[]): {
  supportedBy: Record<string, Set<number>>;
  supports: Record<string, Set<number>>;
  removable: Set<number>;
} {
  const brickStack: number[][] = [];
  const settled: Brick[] = [];
  const supportedBy: Record<string, Set<number>> = {};
  const supports: Record<string, Set<number>> = {};
  const removable: Set<number> = new Set();

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    const [[, , z1], [, , z2]] = brick;

    let j = z1;
    while (true) {
      if (j <= 1) break;
      if (brickStack[j - 1]?.some((x) => overlapsXY(settled[x], brick))) break;
      j--;
    }

    for (let k = z1; k <= z2; k++) {
      const delta = k - z1;
      brickStack[j + delta] ??= [];
      brickStack[j + delta].push(i);
    }
    settled[i] = JSON.parse(JSON.stringify(brick));
    settled[i][0][2] -= z1 - j;
    settled[i][1][2] -= z1 - j;
  }

  for (let i = 0; i < settled.length; i++) {
    const brick = settled[i];
    supportedBy[i] = new Set();
    for (const supporter of brickStack[brick[0][2] - 1] ?? []) {
      if (overlapsXY(settled[supporter], brick)) supportedBy[i].add(supporter);
    }
  }

  for (const [supported, supporters] of Object.entries(supportedBy)) {
    for (const supporter of supporters) {
      supports[supporter] ??= new Set();
      supports[supporter].add(Number(supported));
    }
  }

  for (let i = 0; i < bricks.length; i++) {
    if ([...(supports[i] ?? [])].every((x) => supportedBy[x].size > 1)) {
      removable.add(i);
    }
  }

  return { supportedBy, supports, removable };
}

function overlapsXY(a: Brick, b: Brick): boolean {
  const aX = [a[0][0], a[1][0]].toSorted((a, b) => a - b);
  const aY = [a[0][1], a[1][1]].toSorted((a, b) => a - b);
  const bX = [b[0][0], b[1][0]].toSorted((a, b) => a - b);
  const bY = [b[0][1], b[1][1]].toSorted((a, b) => a - b);

  const xDoesNotOverlap = aX[0] > bX[1] || bX[0] > aX[1];
  const yDoesNotOverlap = aY[0] > bY[1] || bY[0] > aY[1];
  return !xDoesNotOverlap && !yDoesNotOverlap;
}

function parseFile(path: string): Brick[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) =>
      x
        .split('~')
        .map((x) => x.split(',').map(Number))
        .toSorted((a, b) => a[2] - b[2]),
    )
    .toSorted((a, b) => a[0][2] - b[0][2]);
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-22/example.txt');
const puzzle = parseFile('./src/day-22/puzzle.txt');

timeExecutionMs(() => console.log(getNumRemovable(example)));
timeExecutionMs(() => console.log(getNumRemovable(puzzle)));

timeExecutionMs(() => console.log(getNumFallen(example)));
timeExecutionMs(() => console.log(getNumFallen(puzzle)));
