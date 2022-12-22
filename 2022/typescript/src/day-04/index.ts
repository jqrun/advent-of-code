import { readFileSync } from 'node:fs';

type Range = [number, number];
type Pair = [Range, Range];

function getNumContaining(pairs: Pair[]): number {
  return pairs.reduce(
    (acc, pair) => acc + (hasContainingRange(pair) ? 1 : 0),
    0
  );
}

function hasContainingRange(pair: Pair): boolean {
  return doesContain(pair[0], pair[1]) || doesContain(pair[1], pair[0]);
}

function doesContain(parent: Range, child: Range): boolean {
  return parent[0] <= child[0] && parent[1] >= child[1];
}

function getNumOverlapping(pairs: Pair[]): number {
  return pairs.reduce(
    (acc, pair) => acc + (hasOverlappingRange(pair) ? 1 : 0),
    0
  );
}

function hasOverlappingRange(pair: Pair): boolean {
  return doesOverlap(pair[0], pair[1]) || doesOverlap(pair[1], pair[0]);
}

function doesOverlap(parent: Range, child: Range): boolean {
  return parent[1] >= child[0] && parent[0] <= child[0];
}

function parseFile(path: string): Pair[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(',').map((y) => y.split('-').map(Number))) as Pair[];
}

const exampleInput = parseFile('./src/day-04/example.txt');
const puzzleInput = parseFile('./src/day-04/puzzle.txt');

console.log(getNumContaining(exampleInput));
console.log(getNumContaining(puzzleInput));

console.log(getNumOverlapping(exampleInput));
console.log(getNumOverlapping(puzzleInput));
