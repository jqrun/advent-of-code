import { readFileSync } from 'node:fs';

type MoveDirection = 'U' | 'R' | 'D' | 'L';

type Move = [MoveDirection, number];

function countTailVisits(moves: Move[]): number {
  return 0;
}

function serialize(x: string, y: string): string {
  return `${x}-${y}`;
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

console.log(JSON.stringify(exampleInput, null, 2));

console.log(countTailVisits(exampleInput));
// console.log(countTailVisits(puzzleInput));

// console.log(functionB(exampleInput));
// console.log(functionB(puzzleInput));
