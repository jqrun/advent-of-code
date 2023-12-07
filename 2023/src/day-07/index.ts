import { readFileSync } from 'node:fs';

interface Hand {
  cards: string;
  bid: number;
}

const CARD_VALS: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
};

function getTotalWinnigs(hands: Hand[], withJokers = false): number {
  let total = 0;
  const sortedHands = hands.toSorted((a, b) =>
    compareCards(a.cards, b.cards, withJokers),
  );
  let rank = 1;
  for (let i = 0; i < sortedHands.length; i++) {
    total += rank * sortedHands[i].bid;
    if (sortedHands[i] !== sortedHands[i + 1]) rank++;
  }
  return total;
}

function compareCards(a: string, b: string, withJokers = false): number {
  const [aType, bType] = [a, b].map((x) => getHandType.run(x, withJokers));
  if (aType !== bType) return aType - bType;

  for (let i = 0; i < a.length; i++) {
    let [aCard, bCard] = [a[i], b[i]];
    if (withJokers) {
      aCard = aCard === 'J' ? '1' : aCard;
      bCard = bCard === 'J' ? '1' : bCard;
    }
    const [aVal, bVal] = [CARD_VALS[aCard], CARD_VALS[bCard]];
    if (aVal !== bVal) return aVal - bVal;
  }

  return 0;
}

const getHandType = (() => {
  let memo: Record<string, number> = {};

  const run = (cards: string, withJokers = false): number => {
    if (cards in memo) return memo[cards];

    const counts: Record<string, number> = {};
    for (const card of cards) {
      counts[card] ??= 0;
      counts[card]++;
    }

    const groups = Array(5).fill(0);
    for (const count of Object.values(counts)) {
      groups[count - 1]++;
    }

    if (withJokers) {
      const jokers = counts['J'];
      if (jokers) {
        groups[jokers - 1]--;
        if (jokers > 3) {
          groups[4] = 1;
        } else if (jokers === 3) {
          if (groups[1]) groups[4] = 1;
          else groups[3] = 1;
        } else if (jokers === 2) {
          if (groups[2]) groups[4] = 1;
          if (groups[1]) groups[3] = 1;
          else groups[2] = 1;
        } else {
          if (groups[3]) groups[4] = 1;
          else if (groups[2]) groups[3] = 1;
          else if (groups[1]) {
            groups[1]--;
            groups[2] = 1;
          } else groups[1]++;
        }
      }
    }

    let type = 1; // high card
    if (groups[4]) type = 7; // 5 of a kind
    else if (groups[3]) type = 6; // 4 of a kind
    else if (groups[2] && groups[1]) type = 5; // full house
    else if (groups[2]) type = 4; // 3 of a kind
    else if (groups[1] > 1) type = 3; // two pairs
    else if (groups[1]) type = 2; // pair
    memo[cards] = type;
    return type;
  };

  const clearMemo = () => (memo = {});
  return { run, clearMemo };
})();

function parseFile(path: string): Hand[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) => {
      const parts = line.split(' ');
      return { cards: parts[0], bid: Number(parts[1]) };
    });
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-07/example.txt');
const puzzleInput = parseFile('./src/day-07/puzzle.txt');

timeExecutionMs(() => console.log(getTotalWinnigs(exampleInput)));
timeExecutionMs(() => console.log(getTotalWinnigs(puzzleInput)));

getHandType.clearMemo();

timeExecutionMs(() => console.log(getTotalWinnigs(exampleInput, true)));
timeExecutionMs(() => console.log(getTotalWinnigs(puzzleInput, true)));
