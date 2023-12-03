import { readFileSync } from 'node:fs';

const NUMS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

function getTotalPartsAndGears(schematic: string[][]): {
  parts: number;
  gears: number;
} {
  let partsTotal = 0;
  const [height, width] = [schematic.length, schematic[0].length];
  const stars: Record<string, number[]> = {};

  let partStart = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = schematic[y][x];
      if (!NUMS.has(cell)) continue;

      if (partStart < 0) partStart = x;
      if (x < width && NUMS.has(schematic[y][x + 1])) continue;

      if (isAdjacentToSymbol(partStart, x, y, schematic)) {
        const partNumber = getPartNumber(partStart, x, y, schematic);
        partsTotal += partNumber;

        for (const gear of getAdjacentStars(partStart, x, y, schematic)) {
          stars[gear] ??= [];
          stars[gear].push(partNumber);
        }
      }

      partStart = -1;
    }
  }

  const gears = Object.entries(stars).reduce((acc, [, parts]) => {
    if (parts.length !== 2) return acc;
    return acc + parts[0] * parts[1];
  }, 0);

  return { parts: partsTotal, gears };
}

function getAdjacentStars(
  xStart: number,
  xEnd: number,
  y: number,
  schematic: string[][],
): string[] {
  const [height, width] = [schematic.length, schematic[0].length];
  const stars = new Set<string>();

  for (let x = xStart; x <= xEnd; x++) {
    for (const [dy, dx] of DIRS) {
      const [yMod, xMod] = [y + dy, x + dx];
      if (yMod < 0 || yMod >= height || xMod < 0 || xMod >= width) continue;
      if (schematic[yMod][xMod] === '*') stars.add(encode(yMod, xMod));
    }
  }

  return [...stars];
}

function isAdjacentToSymbol(
  xStart: number,
  xEnd: number,
  y: number,
  schematic: string[][],
): boolean {
  const [height, width] = [schematic.length, schematic[0].length];

  for (let x = xStart; x <= xEnd; x++) {
    for (const [dy, dx] of DIRS) {
      const [yMod, xMod] = [y + dy, x + dx];
      if (yMod < 0 || yMod >= height || xMod < 0 || xMod >= width) continue;
      if (isSymbol(schematic[yMod][xMod])) return true;
    }
  }

  return false;
}

function getPartNumber(
  xStart: number,
  xEnd: number,
  y: number,
  schematic: string[][],
): number {
  let partNumber = '';
  for (let x = xStart; x <= xEnd; x++) partNumber += schematic[y][x];
  return Number(partNumber);
}

function encode(y: number, x: number): string {
  return `${y}-${x}`;
}

function isSymbol(char: string): boolean {
  return char !== '.' && !NUMS.has(char);
}

function parseFile(path: string): string[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) => line.split(''));
}

const exampleInput = parseFile('./src/day-03/example.txt');
const puzzleInput = parseFile('./src/day-03/puzzle.txt');

console.log(getTotalPartsAndGears(exampleInput));
console.log(getTotalPartsAndGears(puzzleInput));
