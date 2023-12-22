import { readFileSync } from 'node:fs';
import { format } from 'pretty-format';

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-TODO/example.txt');
const puzzle = parseFile('./src/day-TODO/puzzle.txt');

console.log(format(example, { min: true }));

// timeExecutionMs(() => console.log(functionA(example)));
// timeExecutionMs(() => console.log(functionA(puzzle)));

// timeExecutionMs(() => console.log(functionB(example)));
// timeExecutionMs(() => console.log(functionB(puzzle)));
