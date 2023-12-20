import { readFileSync } from 'node:fs';

type Part = Record<string, number>;

interface Condition {
  category: string;
  op: string;
  value: number;
  dest: string;
}

interface Workflow {
  conditions: Condition[];
  next: string;
}

type Workflows = Record<string, Workflow>;

interface System {
  workflows: Workflows;
  parts: Part[];
}

type Range = Record<string, number[]>;

interface RangeTarget {
  range: Range;
  target: string;
}

function getPossibleCombinations(workflows: Workflows): number {
  const stack: RangeTarget[] = [
    {
      range: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
      target: 'in',
    },
  ];
  const accepted: Range[] = [];

  stackLoop: while (stack.length) {
    const { range, target } = stack.pop()!;
    if (target === 'R') continue;
    if (target === 'A') {
      accepted.push(range);
      continue;
    }

    const { conditions, next } = workflows[target];
    for (const { category, op, value, dest } of conditions) {
      const newRange = JSON.parse(JSON.stringify(range));
      const [lo, hi] = range[category];
      if (op === '<') {
        if (hi < value) {
          stack.push({ target: dest, range: newRange });
          continue stackLoop;
        } else {
          newRange[category] = [lo, value - 1];
          range[category][0] = value;
          stack.push({ target: dest, range: newRange });
        }
      } else if (op === '>') {
        if (lo > value) {
          stack.push({ target: dest, range: newRange });
          continue stackLoop;
        } else {
          newRange[category] = [value + 1, hi];
          range[category][1] = value;
          stack.push({ target: dest, range: newRange });
        }
      }
    }
    stack.push({ target: next, range });
  }

  let total = 0;
  for (const range of accepted) {
    total += Object.values(range).reduce(
      (acc, curr) => acc * (curr[1] - curr[0] + 1),
      1,
    );
  }

  return total;
}

function getAllAccepted(system: System): number {
  let total = 0;
  for (const part of system.parts) {
    if (!isAccepted(part, system.workflows)) continue;
    total += Object.values(part).reduce((acc, curr) => acc + curr, 0);
  }
  return total;
}

function isAccepted(part: Part, workflows: Workflows): boolean {
  let curr = 'in';
  execLoop: while (true) {
    if (curr === 'A') return true;
    if (curr === 'R') return false;

    const { conditions, next } = workflows[curr];
    for (const { category, op, value, dest } of conditions) {
      if (!execOp(op, part[category], value)) continue;
      curr = dest;
      continue execLoop;
    }
    curr = next;
  }
}

function execOp(op: string, a: number, b: number): boolean {
  if (op === '>') return a > b;
  return a < b;
}

function parseFile(path: string): System {
  const [block1, block2] = readFileSync(path, 'utf-8')
    .split('\n\n')
    .map((x) => x.split('\n'));

  const workflows: Workflows = {};
  for (const x of block1) {
    const tokens = x.split(/[{,}]/).filter(Boolean);
    const label = tokens.shift()!;
    const next = tokens.pop()!;
    const conditions: Condition[] = [];
    for (const token of tokens) {
      const [categoryOp, dest] = token.split(':');
      const [category, op, valStr] = categoryOp.split(/([<>])/);
      conditions.push({ category, op, value: Number(valStr), dest });
    }
    workflows[label] = { conditions, next };
  }

  const parts = block2.map((x) => {
    const part: Record<string, number> = {};
    const categories = x.split(/[{,}]/).filter(Boolean);
    for (const category of categories) {
      const [char, valStr] = category.split('=');
      part[char] = Number(valStr);
    }
    return part;
  });

  return { workflows, parts };
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-19/example.txt');
const puzzle = parseFile('./src/day-19/puzzle.txt');

timeExecutionMs(() => console.log(getAllAccepted(example)));
timeExecutionMs(() => console.log(getAllAccepted(puzzle)));

timeExecutionMs(() => console.log(getPossibleCombinations(example.workflows)));
timeExecutionMs(() => console.log(getPossibleCombinations(puzzle.workflows)));
