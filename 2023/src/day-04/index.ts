import { readFileSync } from 'node:fs';

function getWinningPoints(cards: number[][][]): number {
  return cards.reduce((acc, card) => {
    const matches = getNumMatches(card);
    return acc + (matches ? 2 ** (matches - 1) : 0);
  }, 0);
}

function getTotalCards(cards: number[][][]): number {
  const counts = Array(cards.length).fill(1);
  for (let i = 0; i < cards.length; i++) {
    const matches = getNumMatches(cards[i]);
    const copyDepth = Math.min(cards.length, i + 1 + matches);
    for (let j = i + 1; j < copyDepth; j++) {
      counts[j] += counts[i];
    }
  }
  return counts.reduce((acc, curr) => acc + curr, 0);
}

function getNumMatches(card: number[][]): number {
  let matches = 0;
  const winningNums = new Set(card[0]);
  for (const num of card[1]) {
    if (winningNums.has(num)) matches++;
  }
  return matches;
}

function parseFile(path: string): number[][][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) =>
      line
        .replace(/.*:/, '')
        .split('|')
        .map((nums) => nums.trim().split(/\s+/).map(Number)),
    );
}

const exampleInput = parseFile('./src/day-04/example.txt');
const puzzleInput = parseFile('./src/day-04/puzzle.txt');

console.log(getWinningPoints(exampleInput));
console.log(getWinningPoints(puzzleInput));

console.log(getTotalCards(exampleInput));
console.log(getTotalCards(puzzleInput));
