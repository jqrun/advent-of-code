import { readFileSync } from 'node:fs';

const DIRS_CLOCKWISE = ['east', 'south', 'west', 'north'] as const;

type Direction = typeof DIRS_CLOCKWISE[number];
type Face = 'up' | 'right' | 'front' | 'left' | 'back' | 'down';

const DIR_MAP: Record<Direction, [number, number]> = {
  east: [0, 1],
  south: [1, 0],
  west: [0, -1],
  north: [-1, 0],
};

const FACES_CLOCKWISE: Record<Face, Face[]> = {
  up: ['right', 'front', 'left', 'back'],
  right: ['up', 'back', 'down', 'front'],
  front: ['up', 'right', 'down', 'left'],
  down: [],
  left: [],
  back: [],
};

FACES_CLOCKWISE.down = [...FACES_CLOCKWISE.up].reverse();
FACES_CLOCKWISE.left = [...FACES_CLOCKWISE.right].reverse();
FACES_CLOCKWISE.back = [...FACES_CLOCKWISE.front].reverse();

interface Guide {
  map: string[][];
  steps: number[];
  turns: string[];
}

interface FaceDetail {
  i: number;
  j: number;
  map: string[][];
  corner: [number, number];
  face: Face;
  neighbors: {
    [key in Direction]: Face;
  };
}

type GlobalFaceMap = Record<string, Record<string, number>>;

type LocalFaceMap = Record<string, FaceDetail>;

interface FaceSpec {
  global: GlobalFaceMap;
  local: LocalFaceMap;
  faceLength: number;
}

function getPasswordAsCube({ map, steps, turns }: Guide): number {
  const { global, local, faceLength } = getFaceSpec(map);
  connectFaces(global, local);

  let x = 0;
  let y = 0;
  let face = 0;
  let direction: Direction = 'east';

  for (let i = 0; i < steps.length; i++) {
    // Handling steps
    let stepsLeft = steps[i];

    while (stepsLeft--) {
      const [dy, dx] = DIR_MAP[direction];

      let newX = x + dx;
      let newY = y + dy;
      let newFace = face;
      let newDirection: Direction = direction;

      // Wrap around if needed.
      if (newY < 0 || newY >= faceLength || newX < 0 || newX >= faceLength) {
        newX = mod(newX, faceLength);
        newY = mod(newY, faceLength);
        newFace = Number(
          Object.entries(local).find(
            ([, faceDetail]) =>
              faceDetail.face === local[face].neighbors[direction]
          )?.[0]
        );

        // Orient new direction
        let newDirecitonIndex = DIRS_CLOCKWISE.indexOf(direction);
        while (
          local[newFace].neighbors[
            DIRS_CLOCKWISE[mod(newDirecitonIndex + 2, 4)]
          ] !== local[face].face
        ) {
          [newX, newY] = [faceLength - 1 - newY, newX];
          newDirecitonIndex = mod(newDirecitonIndex + 1, 4);
        }

        newDirection = DIRS_CLOCKWISE[newDirecitonIndex];
      }

      if (local[newFace].map[newY][newX] === '#') break;

      x = newX;
      y = newY;
      face = newFace;
      direction = newDirection;
    }

    // No more turns
    if (i >= turns.length) continue;

    // Handling turn
    const turn = turns[i];
    const directionIndex = DIRS_CLOCKWISE.indexOf(direction);
    if (turn === 'R') {
      direction = DIRS_CLOCKWISE[mod(directionIndex + 1, 4)];
    } else if (turn === 'L') {
      direction = DIRS_CLOCKWISE[mod(directionIndex - 1, 4)];
    }
  }

  const row = local[face].i * faceLength + y + 1;
  const col = local[face].j * faceLength + x + 1;
  return 1000 * row + 4 * col + DIRS_CLOCKWISE.indexOf(direction);
}

function connectFaces(global: GlobalFaceMap, local: LocalFaceMap): void {
  local[0].face = 'up';
  updateNeighbors(local[0], DIRS_CLOCKWISE[0], 'right');

  const finished: Set<number> = new Set();

  (function crawl(n: number) {
    finished.add(n);

    const { i, j } = local[n];
    const neighbors = {
      north: global[i - 1] && global[i - 1][j],
      east: global[i][j + 1],
      south: global[i + 1] && global[i + 1][j],
      west: global[i][j - 1],
    };

    for (const dir of DIRS_CLOCKWISE) {
      if (neighbors[dir] && !finished.has(neighbors[dir])) {
        const oppositeDirIndex = mod(DIRS_CLOCKWISE.indexOf(dir) + 2, 4);
        const oppositeDir = DIRS_CLOCKWISE[oppositeDirIndex];

        local[neighbors[dir]].face = local[n].neighbors[dir];
        updateNeighbors(local[neighbors[dir]], oppositeDir, local[n].face);
        crawl(neighbors[dir]);
      }
    }
  })(0);
}

function updateNeighbors(face: FaceDetail, dir: Direction, neighbor: Face) {
  const dirIndex = DIRS_CLOCKWISE.indexOf(dir);
  const faceIndex = FACES_CLOCKWISE[face.face].indexOf(neighbor);

  for (let i = 0; i < 4; i++) {
    const neighborDir = DIRS_CLOCKWISE[(dirIndex + i) % 4];
    const neighborFace = FACES_CLOCKWISE[face.face][(faceIndex + i) % 4];
    face.neighbors[neighborDir] = neighborFace;
  }
}

function getFaceSpec(map: Guide['map']): FaceSpec {
  const faceLength = Math.sqrt(map.flat().filter((x) => x != ' ').length / 6);

  const globalMap: GlobalFaceMap = {};
  const localMap: LocalFaceMap = {};

  let faceNum = 0;
  for (let i = 0; i < map.length / faceLength; i++) {
    globalMap[i] = {};
    for (let j = 0; j < map[0].length / faceLength; j++) {
      const cornerTile = map[i * faceLength][j * faceLength];
      if (cornerTile !== ' ') {
        const localMapArr = map
          .slice(i * faceLength, (i + 1) * faceLength)
          .map((x) => x.slice(j * faceLength, (j + 1) * faceLength));

        globalMap[i][j] = faceNum;
        localMap[faceNum] = {
          i,
          j,
          map: localMapArr,
          corner: [i * faceLength, j * faceLength],
          face: 'up',
          neighbors: {
            north: 'up',
            east: 'up',
            south: 'up',
            west: 'up',
          },
        };

        faceNum++;
      }
    }
  }

  return { global: globalMap, local: localMap, faceLength };
}

function getPassword({ map, steps, turns }: Guide): number {
  const position = [0, 0];
  let facing = 0;

  const [rows, cols] = [map.length, map[0].length];

  for (let col = 0; col < map[0].length; col++) {
    if (map[0][col] === '.') {
      position[1] = col;
      break;
    }
  }

  for (let i = 0; i < steps.length; i++) {
    // Handling steps
    let stepsLeft = steps[i];
    const [modRow, modCol] = Object.values(DIR_MAP)[facing];

    while (stepsLeft--) {
      const [prevRow, prevCol] = position;
      let row = prevRow + modRow;
      let col = prevCol + modCol;

      // Wrap around if needed.
      if (
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols ||
        map[row][col] === ' '
      ) {
        switch (facing) {
          // Right
          case 0:
            col = 0;
            break;
          // Down
          case 1:
            row = 0;
            break;
          // Left
          case 2:
            col = cols - 1;
            break;
          // Up
          case 3:
            row = rows - 1;
            break;
        }

        while (map[row][col] === ' ') {
          row += modRow;
          col += modCol;
        }
      }

      if (map[row][col] === '#') break;

      position[0] = row;
      position[1] = col;
    }

    // No more turns
    if (i >= turns.length) continue;

    // Handling turn
    const turn = turns[i];
    facing = facing + (turn === 'R' ? 1 : -1);
    facing = mod(facing, 4);
  }

  const [row, col] = position.map((x) => x + 1);
  return 1000 * row + 4 * col + facing;
}

function mod(x: number, y: number): number {
  return ((x % y) + y) % y;
}

function parseFile(path: string): Guide {
  const [rawMap, rawSteps] = readFileSync(path, 'utf-8').split('\n\n');

  const map = rawMap.split('\n').map((x) => x.split(''));
  let maxCols = map[0].length;
  for (const row of map) {
    maxCols = Math.max(row.length, maxCols);
  }

  for (const row of map) {
    while (row.length < maxCols) row.push(' ');
  }

  const steps = rawSteps.match(/\d+/g)?.map(Number) as number[];
  const turns = rawSteps.split(/\d+/g).filter(Boolean);

  return { map, steps, turns };
}

const exampleInput = parseFile('./src/day-22/example.txt');
const puzzleInput = parseFile('./src/day-22/puzzle.txt');

console.log(getPassword(exampleInput));
console.log(getPassword(puzzleInput));

console.log(getPasswordAsCube(exampleInput));
console.log(getPasswordAsCube(puzzleInput));
