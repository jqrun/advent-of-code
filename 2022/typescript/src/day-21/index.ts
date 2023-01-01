import { readFileSync } from 'node:fs';

const OPS = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
} as const;

type Op = keyof typeof OPS;

interface Combo {
  op: Op;
  left: string;
  right: string;
}

interface Monkey {
  id: string;
  combo?: Combo;
  value?: number;
}

function findHumn(monkeys: Monkey[]): number {
  let maxSearch = 300;
  let stepSize = 1;

  while (true) {
    maxSearch += stepSize;
    stepSize *= 2;

    const result = getRoot(monkeys, true, maxSearch);
    if (result === 0) return maxSearch;
    if (result < 0) break;
  }

  let left = 300;
  let right = maxSearch;

  while (true) {
    const mid = Math.floor((right + left) / 2);
    const result = getRoot(monkeys, true, mid);
    if (result === 0) return mid;
    else if (result < 0) right = mid;
    else left = mid + 1;
  }
}

function getRoot(monkeys: Monkey[], findHumn = false, humn = 0): number {
  const pending = monkeys.filter((x) => !('value' in x));
  const values: Record<string, number> = {};
  monkeys
    .filter((x) => 'value' in x)
    .forEach(({ id, value }) => (values[id] = value as number));

  if (findHumn) {
    values.humn = humn;
  }

  while (pending.length) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const { id, combo } = pending[i];
      const { op, left, right } = combo as Combo;
      if (!(left in values) || !(right in values)) continue;

      const unsafeEval = `${values[left]} ${op} ${values[right]}`;
      values[id] = eval(unsafeEval);
      pending.splice(i, 1);

      if (findHumn && id === 'root') {
        values.root = values[left] - values[right];
      }
    }
  }

  return values.root;
}

function parseFile(path: string): Monkey[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      const edit = x.split(': ');
      const id = edit[0];
      const right = edit[1].split(' ');

      if (right.length === 1) {
        return {
          id,
          value: Number(right[0]),
        };
      } else {
        return {
          id,
          combo: {
            op: right[1] as Op,
            left: right[0],
            right: right[2],
          },
        };
      }
    });
}

const exampleInput = parseFile('./src/day-21/example.txt');
const puzzleInput = parseFile('./src/day-21/puzzle.txt');

console.log(getRoot(exampleInput));
console.log(getRoot(puzzleInput));

console.log(findHumn(exampleInput));
console.log(findHumn(puzzleInput));
