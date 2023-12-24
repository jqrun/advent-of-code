import { readFileSync } from 'node:fs';
import BigNumber from 'bignumber.js';

// y = mx + b
// m = vy/vx
// b = py - m*px
// m1x + b1 = m2x + b2
// x = (b2 - b1) / (m1 - m2)

function getPerfectThrow(stones: number[][][]): number {
  let potentialX = new Set<number>();
  let potentialY = new Set<number>();
  let potentialZ = new Set<number>();

  for (let i = 0; i < stones.length; i++) {
    for (let j = i; j < stones.length; j++) {
      const [[x1, y1, z1], [vx1, vy1, vz1]] = stones[i];
      const [[x2, y2, z2], [vx2, vy2, vz2]] = stones[j];

      if (vx1 === vx2) {
        const potentials = new Set<number>();
        const delta = x2 - x1;
        for (let v = -1000; v <= 1000; v++) {
          if (v === vx1 || delta % (v - vx1) === 0) potentials.add(v);
        }
        if (!potentialX.size) potentialX = potentials;
        else potentialX = intersectSets(potentialX, potentials);
      }
      if (vy1 === vy2) {
        const potentials = new Set<number>();
        const delta = y2 - y1;
        for (let v = -1000; v <= 1000; v++) {
          if (v === vy1 || delta % (v - vy1) === 0) potentials.add(v);
        }
        if (!potentialY.size) potentialY = potentials;
        else potentialY = intersectSets(potentialY, potentials);
      }
      if (vz1 === vz2) {
        const potentials = new Set<number>();
        const delta = z2 - z1;
        for (let v = -1000; v <= 1000; v++) {
          if (v === vz1 || delta % (v - vz1) === 0) potentials.add(v);
        }
        if (!potentialZ.size) potentialZ = potentials;
        else potentialZ = intersectSets(potentialZ, potentials);
      }
    }
  }

  const [vx0, vy0, vz0] = [potentialX, potentialY, potentialZ].map((x) =>
    BigNumber([...x][0]),
  );
  const [x1, y1, z1, vx1, vy1, vz1] = stones[0].flat().map((x) => BigNumber(x));
  const [x2, y2, , vx2, vy2] = stones[1].flat().map((x) => BigNumber(x));
  const m1 = vy1.minus(vy0).dividedBy(vx1.minus(vx0));
  const m2 = vy2.minus(vy0).dividedBy(vx2.minus(vx0));
  const b1 = y1.minus(m1.times(x1));
  const b2 = y2.minus(m2.times(x2));
  const x = b2.minus(b1).dividedBy(m1.minus(m2));
  const y = m1.times(x).plus(b1);
  const time = x.minus(x1).dividedBy(vx1.minus(vx0));
  const z = z1.plus(vz1.minus(vz0).times(time));

  return x.plus(y).plus(z).toNumber();
}

function intersectSets<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of a) {
    if (b.has(item)) result.add(item);
  }
  return result;
}

function getNumXYIntersections(
  stones: number[][][],
  start = 7,
  end = 27,
): number {
  let count = 0;
  for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
      const [[x1, y1], [vx1, vy1]] = stones[i];
      const [[x2, y2], [vx2, vy2]] = stones[j];
      const [m1, m2] = [vy1 / vx1, vy2 / vx2];
      const [b1, b2] = [y1 - m1 * x1, y2 - m2 * x2];

      // Parallel
      if (m1 === m2) continue;

      const x = (b2 - b1) / (m1 - m2);
      const y = m1 * x + b1;

      // In the past
      if ((x < x1 && vx1 > 0) || (x > x1 && vx1 < 0)) continue;
      if ((x < x2 && vx2 > 0) || (x > x2 && vx2 < 0)) continue;

      if (start <= x && x <= end && start <= y && y <= end) count++;
    }
  }
  return count;
}

function parseFile(path: string): number[][][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(' @ ').map((x) => x.split(',').map(Number)));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-24/example.txt');
const puzzle = parseFile('./src/day-24/puzzle.txt');

timeExecutionMs(() => console.log(getNumXYIntersections(example)));
timeExecutionMs(() =>
  console.log(
    getNumXYIntersections(puzzle, 200_000_000_000_000, 400_000_000_000_000),
  ),
);

timeExecutionMs(() => console.log(getPerfectThrow(puzzle)));
