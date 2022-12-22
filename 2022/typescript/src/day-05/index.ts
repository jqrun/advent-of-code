import { readFileSync } from 'node:fs';

type Stack = string[];

interface Move {
  amount: number;
  from: number;
  to: number;
}

interface Procedure {
  stacks: Stack[];
  moves: Move[];
}

function runProcedure(procedure: Procedure): string {
  const stacks: Stack[] = [...procedure.stacks.map((x) => [...x])];

  for (const { amount, from, to } of procedure.moves) {
    for (let i = 0; i < amount; i++) {
      stacks[to - 1].push(stacks[from - 1].pop() as string);
    }
  }

  return stacks
    .filter((x) => x.length)
    .map((y) => y.slice(-1)[0])
    .join('');
}

function runProcedure9001(procedure: Procedure): string {
  const stacks: Stack[] = [...procedure.stacks.map((x) => [...x])];

  for (const { amount, from, to } of procedure.moves) {
    const source = stacks[from - 1];
    stacks[to - 1].push(...source.splice(source.length - amount, amount));
  }

  return stacks
    .filter((x) => x.length)
    .map((y) => y.slice(-1)[0])
    .join('');
}

function parseFile(path: string): Procedure {
  const input = readFileSync(path, 'utf-8');
  const [stackLines, moveLines] = input.split('\n\n').map((x) => x.split('\n'));
  const numStacks = Number(
    stackLines.splice(-1, 1)[0].replaceAll(' ', '').split('').slice(-1)[0]
  );

  const stacks: Stack[] = [...Array(numStacks)].map(() => []);
  const moves: Move[] = [];

  for (const line of stackLines) {
    for (let i = 0; i < line.length; i++) {
      if (i % 4 !== 1) continue;

      if (line[i] !== ' ') stacks[(i + 3) / 4 - 1].unshift(line[i]);
    }
  }

  for (const move of moveLines) {
    const [amount, from, to] = move
      .replaceAll('move ', '')
      .replaceAll('from ', '')
      .replaceAll('to ', '')
      .split(' ')
      .map(Number);

    moves.push({ amount, from, to });
  }

  return { stacks, moves };
}

const exampleInput = parseFile('./src/day-05/example.txt');
const puzzleInput = parseFile('./src/day-05/puzzle.txt');

console.log(runProcedure(exampleInput));
console.log(runProcedure(puzzleInput));

console.log(runProcedure9001(exampleInput));
console.log(runProcedure9001(puzzleInput));
