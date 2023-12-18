import { readFileSync } from 'node:fs';

const DIRS: Record<string, number[]> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function translatePlan(plan: string[][]): string[][] {
  const dirLetterMap: Record<string, string> = {
    0: 'R',
    1: 'D',
    2: 'L',
    3: 'U',
  };
  return plan.map((line) => {
    const dist = String(parseInt(line[2].slice(2, 7), 16));
    const dir = dirLetterMap[line[2][7]];
    return [dir, dist];
  });
}

function getLagoonSize(plan: string[][]): number {
  const coords = getCoordinates(plan);

  let shoelace = 0;
  for (let i = 0; i < coords.length; i++) {
    shoelace += coords[i][1] * coords[(i + 1) % coords.length][0];
    shoelace -= coords[i][0] * coords[(i + 1) % coords.length][1];
  }
  const totalArea = Math.abs(shoelace) / 2;

  let boundary = 0;
  for (const [, distStr] of plan) {
    boundary += Number(distStr);
  }

  const interior = totalArea + 1 - boundary / 2;

  return interior + boundary;
}

function getCoordinates(plan: string[][]): number[][] {
  const coords = [];
  let [y, x] = [0, 0];

  for (const [dir, distStr] of plan) {
    const [dy, dx] = DIRS[dir];
    const dist = Number(distStr);
    y += dy * dist;
    x += dx * dist;
    coords.push([y, x]);
  }

  return coords;
}

function parseFile(path: string): string[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(' '));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-18/example.txt');
const puzzle = parseFile('./src/day-18/puzzle.txt');

timeExecutionMs(() => console.log(getLagoonSize(example)));
timeExecutionMs(() => console.log(getLagoonSize(puzzle)));

timeExecutionMs(() => console.log(getLagoonSize(translatePlan(example))));
timeExecutionMs(() => console.log(getLagoonSize(translatePlan(puzzle))));
