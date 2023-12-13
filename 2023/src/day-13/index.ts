import { readFileSync } from 'node:fs';

function totalUnsmudged(grids: string[][][]): number {
  let total = 0;

  for (const grid of grids) {
    const original = findReflection(grid);
    const reflection = removeSmudge(grid, original);
    total += reflection.col ? reflection.col : (reflection.row ?? 0) * 100;
  }

  return total;
}

function totalReflections(grids: string[][][]): number {
  let total = 0;

  for (const grid of grids) {
    const reflection = findReflection(grid);
    total += reflection.col ? reflection.col : (reflection.row ?? 0) * 100;
  }

  return total;
}

function removeSmudge(
  grid: string[][],
  original: { col?: number; row?: number },
): { col?: number; row?: number } {
  const [height, width] = [grid.length, grid[0].length];
  const newGrid = grid.slice(0).map((x) => x.slice(0));
  const flip = (x: string) => (x === '.' ? '#' : '.');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      newGrid[y][x] = flip(newGrid[y][x]);
      const reflection = findReflection(newGrid, original);
      if (reflection.col || reflection.row) {
        return reflection;
      }
      newGrid[y][x] = flip(newGrid[y][x]);
    }
  }

  return original;
}

function findReflection(
  grid: string[][],
  ignore: { col?: number; row?: number } = {},
): { col?: number; row?: number } {
  const [height, width] = [grid.length, grid[0].length];
  let candidates = findLineReflections(grid[0]);

  for (let i = 1; i < height; i++) {
    candidates = findLineReflections(grid[i], candidates);
    if (!candidates.size) break;
  }
  if (ignore.col) candidates.delete(ignore.col - 1);
  if (candidates.size) return { col: [...candidates][0] + 1 };

  candidates = findLineReflections(getColumn(grid, 0));
  for (let i = 1; i < width; i++) {
    candidates = findLineReflections(getColumn(grid, i), candidates);
    if (!candidates.size) return {};
  }
  if (ignore.row) candidates.delete(ignore.row - 1);
  return { row: [...candidates][0] + 1 };
}

function findLineReflections(
  line: string[],
  candidates: Set<number> = new Set(),
): Set<number> {
  const reflections = new Set<number>();
  if (!candidates.size) {
    for (const i of [...Array(line.length - 1).keys()]) candidates.add(i);
  }

  iLoop: for (const i of candidates) {
    let [left, right] = [i, i + 1];
    while (left >= 0 && right < line.length) {
      if (line[left--] !== line[right++]) continue iLoop;
    }
    reflections.add(i);
  }
  return reflections;
}

function getColumn(grid: string[][], idx: number): string[] {
  const column = [];
  for (let i = 0; i < grid.length; i++) {
    column.push(grid[i][idx]);
  }
  return column;
}

function parseFile(path: string): string[][][] {
  return readFileSync(path, 'utf-8')
    .split('\n\n')
    .map((x) => x.split('\n').map((x) => x.split('')));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-13/example.txt');
const puzzle = parseFile('./src/day-13/puzzle.txt');

timeExecutionMs(() => console.log(totalReflections(example)));
timeExecutionMs(() => console.log(totalReflections(puzzle)));

timeExecutionMs(() => console.log(totalUnsmudged(example)));
timeExecutionMs(() => console.log(totalUnsmudged(puzzle)));
