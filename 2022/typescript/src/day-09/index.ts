import { readFileSync } from 'node:fs';

type MoveDirection = 'U' | 'R' | 'D' | 'L';

type Move = [MoveDirection, number];

type Coord = [number, number];

const DIRS: Record<MoveDirection, Coord> = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

function countTailVisitsWithKnots(moves: Move[], numKnots = 10): number {
  const visited = new Set([serialize([0, 0])]);
  const knots: Coord[] = [...Array(numKnots)].map(() => [0, 0]);

  for (const [dir, distance] of moves) {
    for (let i = 0; i < distance; i++) {
      const [xMod, yMod] = DIRS[dir];

      for (let j = 0; j < knots.length; j++) {
        const curr = knots[j];
        if (j === 0) {
          curr[0] += xMod;
          curr[1] += yMod;
          continue;
        }

        const prev = knots[j - 1];
        const notTouching =
          Math.abs(prev[0] - curr[0]) > 1 || Math.abs(prev[1] - curr[1]) > 1;
        const notSameX = prev[0] !== curr[0];
        const notSameY = prev[1] !== curr[1];
        if (notTouching) {
          if (notSameX) curr[0] += prev[0] - curr[0] > 0 ? 1 : -1;
          if (notSameY) curr[1] += prev[1] - curr[1] > 0 ? 1 : -1;
        }

        if (j === knots.length - 1) visited.add(serialize(curr));
      }
    }
  }

  return visited.size;
}

function serialize(coord: Coord): string {
  return `${coord[0]}-${coord[1]}`;
}

function parseFile(path: string): Move[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      const [move, numStr] = x.split(' ');
      return [move as MoveDirection, Number(numStr)];
    });
}

const exampleInput = parseFile('./src/day-09/example.txt');
const puzzleInput = parseFile('./src/day-09/puzzle.txt');

console.log(countTailVisitsWithKnots(exampleInput, 2));
console.log(countTailVisitsWithKnots(puzzleInput, 2));

console.log(countTailVisitsWithKnots(exampleInput, 10));
console.log(countTailVisitsWithKnots(puzzleInput, 10));
