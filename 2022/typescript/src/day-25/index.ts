import { readFileSync } from 'node:fs';

const SNAFU_MAP: Record<string, number> = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
};

const SNAFU_REVERSE_MAP: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '=',
  '4': '-',
};

function getFuelSum(snafus: string[]): string {
  const decimals = snafus.map(toDecimal);
  return toSnafu(decimals.reduce((acc, x) => acc + x, 0));
}

function toDecimal(snafu: string): number {
  let total = 0;

  const chars = snafu.split('');
  for (let i = chars.length - 1; i >= 0; i--) {
    total += Math.pow(5, chars.length - 1 - i) * SNAFU_MAP[chars[i]];
  }
  return total;
}

function toSnafu(decimal: number): string {
  let snafu = '';

  while (decimal > 0) {
    const rem = decimal % 5;
    decimal = Math.floor(decimal / 5);
    snafu += SNAFU_REVERSE_MAP[rem];
    if (rem > 2) decimal++;
  }

  return snafu ? snafu.split('').reverse().join('') : '0';
}

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

const exampleInput = parseFile('./src/day-25/example.txt');
const puzzleInput = parseFile('./src/day-25/puzzle.txt');

console.log(getFuelSum(exampleInput));
console.log(getFuelSum(puzzleInput));
