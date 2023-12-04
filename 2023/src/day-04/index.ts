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

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-04/example.txt');
const puzzleInput = parseFile('./src/day-04/puzzle.txt');

timeExecutionMs(() => console.log(getWinningPoints(exampleInput)));
timeExecutionMs(() => console.log(getWinningPoints(puzzleInput)));

timeExecutionMs(() => console.log(getTotalCards(exampleInput)));
timeExecutionMs(() => console.log(getTotalCards(puzzleInput)));
