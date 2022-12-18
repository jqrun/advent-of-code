import { readFileSync } from 'node:fs';

function getMostCals(inventories: number[][]) {
  return Math.max(
    ...inventories.map((x) => x.reduce((acc, item) => acc + item, 0))
  );
}

function getTop3Cals(inventories: number[][]) {
  const topSorted = inventories.map((x) =>
    x.reduce((acc, item) => acc + item, 0)
  );

  topSorted.sort((a, b) => b - a);
  return topSorted.slice(0, 3).reduce((acc, sum) => acc + sum, 0);
}

function parseFile(path: string): number[][] {
  return readFileSync(path, 'utf-8')
    .split('\n\n')
    .map((x) => x.split('\n').map(Number));
}

const exampleInput = parseFile('./src/day-01/example.txt');
const puzzleInput = parseFile('./src/day-01/puzzle.txt');

console.log(getMostCals(exampleInput));
console.log(getMostCals(puzzleInput));

console.log(getTop3Cals(exampleInput));
console.log(getTop3Cals(puzzleInput));
