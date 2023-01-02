import { Dir, readFileSync } from 'node:fs';

const DIRECTIONS = {
  N: [-1, 0],
  NE: [-1, 1],
  E: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1],
  W: [0, -1],
  NW: [-1, -1],
};

type Direction = keyof typeof DIRECTIONS;
type CardinalDirection = 'N' | 'E' | 'S' | 'W';

const DIRECTIONS_KEYS = Object.keys(DIRECTIONS) as Direction[];

interface Proposal {
  check: Direction[];
  move: CardinalDirection;
}

type ElfMap = Record<string, [number, number]>;

const PROPOSALS: Proposal[] = [
  {
    check: ['N', 'NE', 'NW'],
    move: 'N',
  },
  {
    check: ['S', 'SE', 'SW'],
    move: 'S',
  },
  {
    check: ['W', 'NW', 'SW'],
    move: 'W',
  },
  {
    check: ['E', 'NE', 'SE'],
    move: 'E',
  },
];

function moveElves(elfMapMutable: ElfMap, findFinishedRound = false): number {
  const elfMap: ElfMap = JSON.parse(JSON.stringify(elfMapMutable));
  const proposalOrder: Proposal[] = JSON.parse(JSON.stringify(PROPOSALS));

  let proposals: Record<string, [string]> = {};
  let positions: Record<string, string> = {};

  const rotateProposalOrder = () => {
    proposalOrder.push(proposalOrder.shift() as Proposal);
  };

  const updatePositions = () => {
    positions = {};
    for (const [id, [y, x]] of Object.entries(elfMap)) {
      positions[serialize(y, x)] = id;
    }
  };
  updatePositions();

  let round = 1;
  while (round++ <= 10 || findFinishedRound) {
    let moved = false;
    for (const [id, [y, x]] of Object.entries(elfMap)) {
      for (const { check, move } of proposalOrder) {
        const checkFn = (dir: Direction): boolean => {
          const [dy, dx] = DIRECTIONS[dir];
          const movePos = serialize(y + dy, x + dx);
          return !(movePos in positions);
        };

        const isIsolated = DIRECTIONS_KEYS.every(checkFn);
        if (isIsolated) continue;

        const canMove = check.every(checkFn);
        if (!canMove) continue;

        const [dy, dx] = DIRECTIONS[move];
        const movePos = serialize(y + dy, x + dx);
        proposals[movePos] = proposals[movePos] ?? [];
        proposals[movePos].push(id);
        break;
      }
    }

    for (const [pos, elves] of Object.entries(proposals)) {
      if (elves.length > 1) continue;

      const [y, x] = deserialize(pos);
      elfMap[elves[0]] = [y, x];
      moved = true;
    }

    if (!moved) break;

    proposals = {};
    updatePositions();
    rotateProposalOrder();
  }

  return findFinishedRound ? round - 1 : getEmptyTiles(elfMap);
}

function getEmptyTiles(map: ElfMap): number {
  const grid = convertToGrid(map);
  let elves = 0;

  for (const row of grid) {
    for (const item of row) {
      if (item === '#') elves++;
    }
  }

  return grid.length * grid[0].length - elves;
}

function convertToGrid(map: ElfMap): string[][] {
  let minX = Number.MAX_VALUE;
  let minY = minX;
  let maxX = Number.MIN_VALUE;
  let maxY = maxX;

  for (const [y, x] of Object.values(map)) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const rows = maxY - minY + 1;
  const cols = maxX - minX + 1;

  const grid = [...Array(rows)].map(() => [...Array(cols)].map(() => '.'));

  for (const [y, x] of Object.values(map)) {
    grid[y - minY][x - minX] = '#';
  }

  return grid;
}

function serialize(x: number, y: number): string {
  return `${x};${y}`;
}

function deserialize(s: string): [number, number] {
  return s.split(';').map(Number) as [number, number];
}

function parseFile(path: string): ElfMap {
  let id = 0;
  const elfMap: ElfMap = {};

  readFileSync(path, 'utf-8')
    .split('\n')
    .forEach((x, i) =>
      x.split('').forEach((y, j) => {
        if (y === '.') return;
        elfMap[id++] = [i, j];
      })
    );

  return elfMap;
}

const exampleInput = parseFile('./src/day-23/example.txt');
const puzzleInput = parseFile('./src/day-23/puzzle.txt');

console.log(moveElves(exampleInput));
console.log(moveElves(puzzleInput));

console.log(moveElves(exampleInput, true));
console.log(moveElves(puzzleInput, true));
