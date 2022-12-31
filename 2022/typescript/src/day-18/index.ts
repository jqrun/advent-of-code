import { readFileSync } from 'node:fs';

type X = number;
type Y = number;
type Z = number;
type Point = [X, Y, Z];

const SIDES: Point[] = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];

function getSurfaceAreaSansAirPockets(points: Point[]): number {
  const lavaSet: Set<string> = new Set();
  const airSet: Set<string> = new Set();
  const lowerBounds = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  const upperBounds = [0, 0, 0];

  for (const [x, y, z] of points) {
    lavaSet.add(serialize(x, y, z));
    lowerBounds[0] = Math.min(lowerBounds[0], x);
    lowerBounds[1] = Math.min(lowerBounds[1], y);
    lowerBounds[2] = Math.min(lowerBounds[2], z);
    upperBounds[0] = Math.max(upperBounds[0], x);
    upperBounds[1] = Math.max(upperBounds[1], y);
    upperBounds[2] = Math.max(upperBounds[2], z);
  }

  const dfs = (point: Point): void => {
    const trappedAir: Set<string> = new Set();
    const visited: Set<string> = new Set();

    const queue: Point[] = [point];

    while (queue.length) {
      const [x, y, z] = queue.shift() as Point;
      const current = serialize(x, y, z);

      const underBounds =
        x <= lowerBounds[0] || y <= lowerBounds[1] || z <= lowerBounds[2];
      const overBounds =
        x >= upperBounds[0] || y >= upperBounds[1] || z >= upperBounds[2];
      const outOfBounds = underBounds || overBounds;

      if (visited.has(current)) continue;
      if (lavaSet.has(current)) continue;
      if (outOfBounds) return;

      visited.add(current);
      trappedAir.add(current);

      for (const [xMod, yMod, zMod] of SIDES) {
        queue.push([x + xMod, y + yMod, z + zMod]);
      }
    }

    trappedAir.forEach((x) => airSet.add(x));
  };

  for (const [x, y, z] of points) {
    for (const [xMod, yMod, zMod] of SIDES) {
      dfs([x + xMod, y + yMod, z + zMod]);
    }
  }

  const airList = [...airSet].map((x) => x.split('-').map(Number) as Point);
  return getTotalSurfaceArea([...points, ...airList]);
}

function getTotalSurfaceArea(points: Point[]): number {
  const cubes: Record<string, number> = {};

  for (const [x, y, z] of points) {
    const current = serialize(x, y, z);
    let exposed = 6;

    for (const [xMod, yMod, zMod] of SIDES) {
      const side = serialize(x + xMod, y + yMod, z + zMod);
      if (side in cubes) {
        cubes[side]--;
        exposed--;
      }
    }

    cubes[current] = exposed;
  }

  return Object.values(cubes).reduce((acc, x) => acc + x, 0);
}

function serialize(x: number, y: number, z: number): string {
  return [x, y, z].join('-');
}

function parseFile(path: string): Point[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(',').map(Number) as Point);
}

const exampleInput = parseFile('./src/day-18/example.txt');
const puzzleInput = parseFile('./src/day-18/puzzle.txt');

console.log(getTotalSurfaceArea(exampleInput));
console.log(getTotalSurfaceArea(puzzleInput));

console.log(getSurfaceAreaSansAirPockets(exampleInput));
console.log(getSurfaceAreaSansAirPockets(puzzleInput));
