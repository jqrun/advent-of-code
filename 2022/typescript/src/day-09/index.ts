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

function countTailVisits(moves: Move[]): number {
  const visited = new Set();
  const head: Coord = [0, 0];
  const tail: Coord = [0, 0];

  for (const [dir, distance] of moves) {
    for (let i = 0; i < distance; i++) {
      const [xMod, yMod] = DIRS[dir];
      const headBeforeMove: Coord = [...head];
      head[0] += xMod;
      head[1] += yMod;

      visited.add(serialize(tail));

      if (Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1) {
        tail.splice(0, 2, ...headBeforeMove);
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

// console.log(JSON.stringify(exampleInput, null, 2));

console.log(countTailVisits(exampleInput));
console.log(countTailVisits(puzzleInput));

// console.log(functionB(exampleInput));
// console.log(functionB(puzzleInput));
