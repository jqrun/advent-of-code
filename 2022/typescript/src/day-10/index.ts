import { readFileSync } from 'node:fs';

interface Instruction {
  noop: boolean;
  addx: number;
}

function renderImage(instructions: Instruction[]): string {
  let image = '';
  let cycle = 0;
  let register = 1;

  const cycleAndRender = () => {
    if (cycle >= register - 1 && cycle <= register + 1) {
      image += '#';
    } else {
      image += '.';
    }

    cycle++;

    if (cycle % 40 === 0) {
      image += '\n';
      cycle = 0;
    }
  };

  for (const { noop, addx } of instructions) {
    if (noop) {
      cycleAndRender();
      continue;
    }

    cycleAndRender();
    cycleAndRender();
    register += addx;
  }

  return image;
}

function getTotalSignalStrength(instructions: Instruction[]): number {
  let total = 0;
  let cycle = 0;
  let register = 1;

  const cycleAndRecord = () => {
    cycle++;
    if ((20 - cycle) % 40 === 0) {
      total += cycle * register;
    }
  };

  for (const { noop, addx } of instructions) {
    if (noop) {
      cycleAndRecord();
      continue;
    }

    cycleAndRecord();
    cycleAndRecord();
    register += addx;
  }

  return total;
}

function parseFile(path: string): Instruction[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      if (x === 'noop') {
        return { noop: true, addx: 0 };
      }

      return {
        noop: false,
        addx: Number(x.split(' ').slice(-1)[0]),
      };
    }) as Instruction[];
}

const exampleInput = parseFile('./src/day-10/example.txt');
const puzzleInput = parseFile('./src/day-10/puzzle.txt');

console.log(getTotalSignalStrength(exampleInput));
console.log(getTotalSignalStrength(puzzleInput));

console.log(renderImage(exampleInput));
console.log(renderImage(puzzleInput));
