import { readFileSync } from 'node:fs';

function getCountUntilDistinctN(subroutine: string[], n: number): number {
  const counts: Record<string, number> = {};
  let left = subroutine[0];

  for (let i = 0; i < subroutine.length; i++) {
    const char = subroutine[i];
    counts[char] = counts[char] ?? 0;
    counts[char]++;

    if (i < n - 1) continue;

    if (Object.keys(counts).length === n) {
      return i + 1;
    }

    counts[left]--;
    if (!counts[left]) delete counts[left];
    left = subroutine[i - (n - 2)];
  }

  return subroutine.length;
}

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('');
}

const exampleInput = parseFile('./src/day-06/example.txt');
const puzzleInput = parseFile('./src/day-06/puzzle.txt');

console.log(getCountUntilDistinctN(exampleInput, 4));
console.log(getCountUntilDistinctN(puzzleInput, 4));

console.log(getCountUntilDistinctN(exampleInput, 14));
console.log(getCountUntilDistinctN(puzzleInput, 14));
