import { readFileSync } from 'node:fs';

function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  const memo: Record<string, Result> = {};

  return (...args) => {
    const key = JSON.stringify(args);
    if (memo[key]) return memo[key];
    const result = fn(...args);
    memo[key] = result;
    return result;
  };
}

function installLenses(strs: string[]): number {
  const boxes: (string | number)[][][] = [...Array(256)].map(() => []);
  const maps: Record<string, number>[] = [...Array(256)].map(() => ({}));
  let power = 0;

  for (const str of strs) {
    const [label, op, val] = str.split(/([=-])/);
    const boxNum = hash(label);
    const [box, map] = [boxes[boxNum], maps[boxNum]];

    if (op === '=') {
      if (label in map && val) {
        box[map[label]][1] = Number(val);
      } else if (val) {
        box.push([label, Number(val)]);
        map[label] = box.length - 1;
      }
    } else {
      if (!(label in map)) continue;
      const removeIdx = map[label];
      delete map[label];
      box.splice(removeIdx, 1);
      for (const [key, idx] of Object.entries(map)) {
        if (idx > removeIdx) map[key]--;
      }
    }
  }

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    for (let j = 0; j < box.length; j++) {
      power += (i + 1) * (j + 1) * Number(box[j][1]);
    }
  }

  return power;
}

function sumHashes(strs: string[]): number {
  return strs.map(hash).reduce((acc, curr) => acc + curr, 0);
}

const hash = memoize((str: string): number => {
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const val = str.charCodeAt(i);
    total = ((total + val) * 17) % 256;
  }
  return total;
});

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split(',');
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-15/example.txt');
const puzzle = parseFile('./src/day-15/puzzle.txt');

timeExecutionMs(() => console.log(sumHashes(example)));
timeExecutionMs(() => console.log(sumHashes(puzzle)));

timeExecutionMs(() => console.log(installLenses(example)));
timeExecutionMs(() => console.log(installLenses(puzzle)));
