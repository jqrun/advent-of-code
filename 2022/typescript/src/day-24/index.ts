import { readFileSync } from 'node:fs';

type Direction = '>' | 'v' | '<' | '^';

const DIRECTIONS: Record<Direction, number[]> = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
};

const DIRECTION_VALS = Object.values(DIRECTIONS);

type BlizzardMap = Record<string, Direction[]>;

interface State {
  traveler: number[];
  target: number[];
  rows: number;
  cols: number;
  map: BlizzardMap;
}

function getShortestDoubleTrip({
  traveler,
  target,
  rows,
  cols,
  map,
}: State): number {
  const total = 0;
  let blizzardMap = map;

  const firstTrip = getShortestPath({ traveler, target, rows, cols, map });

  for (let i = 0; i < firstTrip; i++) {
    blizzardMap = getNextBlizzard(blizzardMap, rows, cols);
  }

  const secondTrip = getShortestPath({
    traveler: target,
    target: traveler,
    rows,
    cols,
    map: blizzardMap,
  });

  for (let i = 0; i < secondTrip; i++) {
    blizzardMap = getNextBlizzard(blizzardMap, rows, cols);
  }

  const thirdTrip = getShortestPath({
    traveler,
    target,
    rows,
    cols,
    map: blizzardMap,
  });

  return firstTrip + secondTrip + thirdTrip;
}

function getShortestPath({ traveler, target, rows, cols, map }: State): number {
  const blizzardCache: Record<string, BlizzardMap> = { 0: map };
  let minutes = Number.MAX_VALUE;

  const queue: number[][] = [[1, traveler[0], traveler[1]]];
  const done: Set<string> = new Set();

  while (queue.length) {
    const [minute, y, x] = queue.shift() as number[];

    const serialized = serialize(minute, y, x);
    if (done.has(serialized)) continue;
    done.add(serialized);

    if (y === target[0] && x === target[1]) {
      minutes = Math.min(minutes, minute - 1);
      continue;
    }

    if (minute >= minutes) continue;

    if (!blizzardCache[minute]) {
      blizzardCache[minute] = getNextBlizzard(
        blizzardCache[minute - 1],
        rows,
        cols
      );
    }
    const blizzardMap = blizzardCache[minute];

    for (const [dy, dx] of DIRECTION_VALS) {
      const newX = x + dx;
      const newY = y + dy;
      if (outOfBounds(newY, newX, rows, cols)) continue;
      if (serialize(newY, newX) in blizzardMap) continue;

      queue.push([minute + 1, newY, newX]);
    }

    if (!(serialize(y, x) in blizzardMap)) {
      queue.push([minute + 1, y, x]);
    }
  }

  return minutes;
}

function getNextBlizzard(
  map: BlizzardMap,
  rows: number,
  cols: number
): BlizzardMap {
  const newMap: BlizzardMap = {};

  for (const [pos, dirs] of Object.entries(map)) {
    for (const dir of dirs) {
      const [dy, dx] = DIRECTIONS[dir];
      const [y, x] = deserialize(pos);

      let newX = mod(x + dx, cols);
      let newY = mod(y + dy, rows);
      while (outOfBounds(newY, newX, rows, cols)) {
        newX = mod(newX + dx, cols);
        newY = mod(newY + dy, rows);
      }

      const newPos = serialize(newY, newX);
      newMap[newPos] = newMap[newPos] ?? [];
      newMap[newPos].push(dir);
    }
  }

  return newMap;
}

function outOfBounds(
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean {
  return (
    col < 0 ||
    col >= cols ||
    row < 0 ||
    row >= rows ||
    isWall(row, col, rows, cols)
  );
}

function serialize(...args: number[]): string {
  return args.join(';');
}

function deserialize(s: string): number[] {
  return s.split(';').map(Number);
}

function mod(x: number, y: number): number {
  return ((x % y) + y) % y;
}

function isWall(row: number, col: number, rows: number, cols: number): boolean {
  if (row === 0 && col === 1) return false;
  else if (row === rows - 1 && col === cols - 2) return false;
  else if (row === 0 || row === rows - 1) return true;
  else if (col === 0 || col === cols - 1) return true;
  return false;
}

function printState({
  traveler,
  rows,
  cols,
  map,
}: Omit<State, 'Target'>): void {
  let str = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === traveler[0] && j === traveler[1]) str += 'E';
      else if (i === 0 && j === 1) str += '.';
      else if (i === rows - 1 && j === cols - 2) str += '.';
      else if (isWall(i, j, rows, cols)) str += '#';
      else if (serialize(i, j) in map) {
        const blizzards = map[serialize(i, j)];
        if (blizzards.length > 1) str += String(blizzards.length);
        else str += blizzards[0];
      } else str += '.';
    }
    str += '\n';
  }
  console.log(str + '\n');
}

function parseFile(path: string): State {
  const traveler = [0, 1];
  const grid = readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(''));
  const map: BlizzardMap = {};

  const rows = grid.length;
  const cols = grid[0].length;

  const target = [rows - 1, cols - 2];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const point = grid[i][j];
      if (point === '.' || point === '#') continue;
      const pos = serialize(i, j);
      map[pos] = [point as Direction];
    }
  }

  return { traveler, target, rows, cols, map };
}

const exampleInput = parseFile('./src/day-24/example.txt');
const puzzleInput = parseFile('./src/day-24/puzzle.txt');

console.log(getShortestPath(exampleInput));
console.log(getShortestPath(puzzleInput));

console.log(getShortestDoubleTrip(exampleInput));
console.log(getShortestDoubleTrip(puzzleInput));
