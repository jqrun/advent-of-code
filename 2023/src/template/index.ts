import { readFileSync } from 'node:fs';

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-TODO/example.txt');
const puzzleInput = parseFile('./src/day-TODO/puzzle.txt');

// console.log(JSON.stringify(exampleInput, null, 2));

// timeExecutionMs(() => console.log(functionA(exampleInput)));
// timeExecutionMs(() => console.log(functionA(puzzleInput)));

// timeExecutionMs(() => console.log(functionB(exampleInput)));
// timeExecutionMs(() => console.log(functionB(puzzleInput)));
