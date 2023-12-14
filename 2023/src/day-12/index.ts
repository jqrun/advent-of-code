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

function unfold(records: [string, number[]][]): [string, number[]][] {
  return records.map((record) => [
    Array(5)
      .fill(0)
      .map(() => record[0])
      .join('?'),
    Array(5)
      .fill(0)
      .map(() => [...record[1]])
      .flat(),
  ]);
}

function getTotalArrangements(records: [string, number[]][]): number {
  return records.reduce((acc, curr, i) => {
    console.log(`Processing record number: ${i}`);
    return acc + countArrangements(...curr);
  }, 0);
}

const countArrangements = memoize((line: string, groups: number[]): number => {
  if (!line.length) {
    if (!groups.length) return 1;
    return 0;
  }

  if (!groups.length) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '#') return 0;
    }
    return 1;
  }

  if (
    line.length <
    groups.reduce((acc, curr) => acc + curr, 0) + groups.length - 1
  ) {
    return 0;
  }

  if (line[0] === '.') return countArrangements(line.slice(1), groups);

  if (line[0] === '#') {
    const [group, ...otherGroups] = groups;
    for (let i = 0; i < group; i++) {
      if (line[i] === '.') return 0;
    }
    if (line[group] === '#') return 0;
    return countArrangements(line.slice(group + 1), otherGroups);
  }

  return (
    countArrangements('#' + line.slice(1), groups) +
    countArrangements('.' + line.slice(1), groups)
  );
});

function parseFile(path: string): [string, number[]][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) => {
      const parts = line.split(' ');
      return [parts[0], parts[1].split(',').map(Number)];
    });
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-12/example.txt');
const puzzle = parseFile('./src/day-12/puzzle.txt');

timeExecutionMs(() => console.log(getTotalArrangements(example)));
timeExecutionMs(() => console.log(getTotalArrangements(puzzle)));

timeExecutionMs(() => console.log(getTotalArrangements(unfold(example))));
timeExecutionMs(() => console.log(getTotalArrangements(unfold(puzzle))));
