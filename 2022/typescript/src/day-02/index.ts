import { readFileSync } from 'node:fs';

type Move = 'A' | 'B' | 'C';

const WIN_MAP: Record<Move, Move> = {
  A: 'C', // Rock > Scissors
  B: 'A', // Paper > Rock
  C: 'B', // Scissors > Paper
};

const LOSE_MAP: Record<Move, Move> = {
  A: 'B', // Rock < Paper
  B: 'C', // Paper > Scissors
  C: 'A', // Scissors < Rock
};

function transformToFitStrategy(pairs: Move[][]): Move[][] {
  return pairs.map(([opponent, instruction]) => {
    if (instruction === 'A') return [opponent, WIN_MAP[opponent]]; // Lose
    else if (instruction === 'B') return [opponent, opponent]; // Draw
    else return [opponent, LOSE_MAP[opponent]]; // Win
  });
}

function getPlayScore(pairs: Move[][]): number {
  let score = 0;

  for (const [opponent, you] of pairs) {
    score += getOutcomeVal(you, opponent) + getMoveVal(you);
  }

  return score;
}

function getOutcomeVal(you: Move, opponent: Move): number {
  if (WIN_MAP[you] === opponent) return 6;
  else if (you === opponent) return 3;
  else return 0;
}

function getMoveVal(move: Move): number {
  return move.charCodeAt(0) - 64;
}

function parseFile(path: string): Move[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      const pair = x.split(' ');
      pair[1] = String.fromCharCode(pair[1].charCodeAt(0) - 23);
      return pair as Move[];
    });
}

const exampleInput = parseFile('./src/day-02/example.txt');
const puzzleInput = parseFile('./src/day-02/puzzle.txt');

console.log(getPlayScore(exampleInput));
console.log(getPlayScore(puzzleInput));

console.log(getPlayScore(transformToFitStrategy(exampleInput)));
console.log(getPlayScore(transformToFitStrategy(puzzleInput)));
