import { readFileSync } from 'node:fs';

function sumGroupBadges(sacks: string[]): number {
  let itemCount: Record<string, number> = {};
  let sum = 0;

  for (let i = 0; i < sacks.length; i++) {
    if (i % 3 === 0) itemCount = {};

    const seen = new Set();
    for (const item of sacks[i].split('')) {
      if (seen.has(item)) continue;
      seen.add(item);

      itemCount[item] = itemCount[item] ?? 0;
      itemCount[item]++;

      if (itemCount[item] === 3) sum += getPriotiy(item);
    }
  }

  return sum;
}

function sumDupedPriority(sacks: string[]): number {
  let sum = 0;

  for (const sack of sacks) {
    const seen = new Set();
    const mid = sack.length / 2;

    for (let i = 0; i < sack.length; i++) {
      if (i < mid) {
        seen.add(sack[i]);
      } else if (seen.has(sack[i])) {
        sum += getPriotiy(sack[i]);
        break;
      }
    }
  }

  return sum;
}

function getPriotiy(item: string): number {
  const adjustment = item === item.toUpperCase() ? 27 : 1;
  return item.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + adjustment;
}

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

const exampleInput = parseFile('./src/day-03/example.txt');
const puzzleInput = parseFile('./src/day-03/puzzle.txt');

console.log(sumDupedPriority(exampleInput));
console.log(sumDupedPriority(puzzleInput));

console.log(sumGroupBadges(exampleInput));
console.log(sumGroupBadges(puzzleInput));
