import { readFileSync } from 'node:fs';

type Op = '+' | '*' | 'sq';

interface Monkey {
  id: number;
  items: number[];
  operation: {
    op: Op;
    value: number;
  };
  testDiv: number;
  trueThrow: number;
  falseThrow: number;
}

function getMonkeyBusiness(
  monkeys: Monkey[],
  rounds = 20,
  reduceWorry = true
): number {
  const inspections = [...Array(monkeys.length)].map(() => 0);
  const clonedMonkeys = monkeys.map((x) => {
    return { ...x, items: [...x.items] };
  });

  const superMod = monkeys.reduce((acc, monkey) => acc * monkey.testDiv, 1);

  for (let round = 0; round < rounds; round++) {
    for (const monkey of clonedMonkeys) {
      while (monkey.items.length) {
        inspections[monkey.id]++;

        let item = monkey.items.shift() as number;
        if (monkey.operation.op === 'sq') {
          item *= item;
        } else if (monkey.operation.op === '+') {
          item += monkey.operation.value;
        } else {
          item *= monkey.operation.value;
        }

        item = item % superMod;

        if (reduceWorry) {
          item = Math.floor(Number(item) / 3);
        }

        const throwTo =
          item % monkey.testDiv === 0 ? monkey.trueThrow : monkey.falseThrow;
        clonedMonkeys[throwTo].items.push(item);
      }
    }
  }

  inspections.sort((a, b) => b - a);
  return inspections[0] * inspections[1];
}

function parseFile(path: string): Monkey[] {
  return readFileSync(path, 'utf-8')
    .split('\n\n')
    .map((x, i) => {
      const lines = x.split('\n');
      const items = lines[1]
        .replace('  Starting items: ', '')
        .split(', ')
        .map(Number);

      let op: Op;
      let opValue: number;
      if (lines[2].includes('old * old')) {
        op = 'sq';
        opValue = 0;
      } else {
        op = lines[2].includes('*') ? '*' : '+';
        opValue = Number(lines[2].split(' ').slice(-1)[0]);
      }

      const testDiv = Number(lines[3].split(' ').slice(-1)[0]);
      const trueThrow = Number(lines[4].split(' ').slice(-1)[0]);
      const falseThrow = Number(lines[5].split(' ').slice(-1)[0]);

      const monkey: Monkey = {
        id: i,
        items,
        operation: {
          op,
          value: opValue,
        },
        testDiv,
        trueThrow,
        falseThrow,
      };
      return monkey;
    });
}

const exampleInput = parseFile('./src/day-11/example.txt');
const puzzleInput = parseFile('./src/day-11/puzzle.txt');

console.log(getMonkeyBusiness(exampleInput));
console.log(getMonkeyBusiness(puzzleInput));

console.log(getMonkeyBusiness(exampleInput, 10_000, false));
console.log(getMonkeyBusiness(puzzleInput, 10_000, false));
