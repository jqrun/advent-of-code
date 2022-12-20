import { readFileSync } from 'node:fs';

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

const exampleInput = parseFile('./src/day-TODO/example.txt');
const puzzleInput = parseFile('./src/day-TODO/puzzle.txt');

// console.log(JSON.stringify(exampleInput, null, 2));

// console.log(functionA(exampleInput));
// console.log(functionA(puzzleInput));

// console.log(functionB(exampleInput));
// console.log(functionB(puzzleInput));
