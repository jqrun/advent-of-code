import { readFileSync } from 'node:fs';

type Coord = [number, number];

interface Data {
  sensor: Coord;
  beacon: Coord;
  distance: number;
}

const DIRS = [
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
] as const;

function findDistressBeacon(data: Data[], limit = 20): number {
  for (const { sensor, distance } of data) {
    const sweep = distance + 1;
    for (const dir of DIRS) {
      for (let i = 0; i <= sweep; i++) {
        const modX = dir[0] * i;
        const modY = dir[1] * (sweep - i);

        const x = sensor[0] + modX;
        const y = sensor[1] + modY;

        if (x < 0 || y < 0 || x > limit || y > limit) continue;

        if (coordCouldBeBeacon(data, [x, y])) {
          return x * 4_000_000 + y;
        }
      }
    }
  }

  return 0;
}

function coordCouldBeBeacon(data: Data[], [x, y]: Coord): boolean {
  for (const datum of data) {
    const range = getRangeAtRow(datum, y);
    if (x >= range[0] && x <= range[1]) return false;
  }

  return true;
}

function getVoidsAtRow(data: Data[], row = 10): number {
  const voids: Set<number> = new Set();

  for (const datum of data) {
    const [a, b] = getRangeAtRow(datum, row);
    for (let i = a; i < b; i++) voids.add(i);
  }

  return voids.size;
}

function getRangeAtRow(
  { sensor, distance }: Data,
  row: number
): [number, number] {
  const [x, y] = sensor;
  const delta = distance - Math.abs(y - row);
  return [x - delta, x + delta];
}

function parseFile(path: string): Data[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      let edit = x.replace('Sensor at x=', '');
      edit = edit.replace(': closest beacon is at x=', ',');
      edit = edit.replaceAll(' y=', '');
      const [sensorX, sensorY, beaconX, beaconY] = edit.split(',').map(Number);
      const distance =
        Math.abs(beaconX - sensorX) + Math.abs(beaconY - sensorY);
      return {
        sensor: [sensorX, sensorY],
        beacon: [beaconX, beaconY],
        distance,
      } as Data;
    });
}

const exampleInput = parseFile('./src/day-15/example.txt');
const puzzleInput = parseFile('./src/day-15/puzzle.txt');

console.log(getVoidsAtRow(exampleInput, 10));
console.log(getVoidsAtRow(puzzleInput, 2_000_000));

console.log(findDistressBeacon(exampleInput, 20));
console.log(findDistressBeacon(puzzleInput, 4_000_000));
