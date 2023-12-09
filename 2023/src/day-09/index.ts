import { readFileSync } from 'node:fs';

function sumExtrapolatedBackward(sets: number[][]): number {
  return sets.map(extrapolatePrev).reduce((acc, curr) => acc + curr, 0);
}

function sumExtrapolatedForward(sets: number[][]): number {
  return sets.map(extrapolateNext).reduce((acc, curr) => acc + curr, 0);
}

function extrapolateNext(nums: number[]): number {
  const ends = [nums[nums.length - 1]];
  let curr = nums;
  while (!curr.every((x) => x === curr[0])) {
    curr = getStepDiffs(curr);
    ends.push(curr[curr.length - 1]);
  }
  for (let i = ends.length - 2; i >= 0; i--) {
    ends[i] += ends[i + 1];
  }
  return ends[0];
}

function extrapolatePrev(nums: number[]): number {
  const starts = [nums[0]];
  let curr = nums;
  while (!curr.every((x) => x === curr[0])) {
    curr = getStepDiffs(curr);
    starts.push(curr[0]);
  }
  for (let i = starts.length - 2; i >= 0; i--) {
    starts[i] -= starts[i + 1];
  }
  return starts[0];
}

function getStepDiffs(nums: number[]): number[] {
  const diffs = [];
  for (let i = 1; i < nums.length; i++) {
    diffs.push(nums[i] - nums[i - 1]);
  }
  return diffs;
}

function parseFile(path: string): number[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(' ').filter(Boolean).map(Number));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-09/example.txt');
const puzzleInput = parseFile('./src/day-09/puzzle.txt');

timeExecutionMs(() => console.log(sumExtrapolatedForward(exampleInput)));
timeExecutionMs(() => console.log(sumExtrapolatedForward(puzzleInput)));

timeExecutionMs(() => console.log(sumExtrapolatedBackward(exampleInput)));
timeExecutionMs(() => console.log(sumExtrapolatedBackward(puzzleInput)));
