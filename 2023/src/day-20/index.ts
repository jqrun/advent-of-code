import { readFileSync } from 'node:fs';

// Broadcaster, Flip Flop, Conjunction, Other
type ModuleType = 'b' | 'ff' | 'c' | 'o';

interface Module {
  label: string;
  type: ModuleType;
  destinations: string[];
  memory: Record<string, number>;
}

type Modules = Record<string, Module>;

interface PulseEvent {
  source: string;
  target: string;
  value: number;
}

function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  const memo = new Map<string, Result>();

  return (...args) => {
    const key = JSON.stringify(args);
    if (memo.has(key)) return memo.get(key)!;
    const result = fn(...args);
    memo.set(key, result);
    return result;
  };
}

function getPressesToRx(modules: Modules): number {
  const vm = getPressesUntilTarget(modules, 'vm');
  const lm = getPressesUntilTarget(modules, 'lm');
  const jd = getPressesUntilTarget(modules, 'jd');
  const fv = getPressesUntilTarget(modules, 'fv');
  return leastCommonMultiple([vm, lm, jd, fv]);
}

function leastCommonMultiple(nums: number[]): number {
  let lcm = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    lcm = (lcm * num) / greatestCommonDivisor(lcm, num);
  }
  return lcm;
}

function greatestCommonDivisor(a: number, b: number): number {
  if (b === 0) return a;
  return greatestCommonDivisor(b, a % b);
}

function getPressesUntilTarget(modules: Modules, target: string): number {
  let presses = 0;
  let curr = modules;
  while (true) {
    const { modules: newModules, targetSignaled } = pressButton(curr, target);
    curr = newModules;
    presses++;
    if (targetSignaled) break;
  }
  return presses;
}

function countSignals(modules: Modules, presses = 1000): number {
  let [lowTotal, highTotal] = [0, 0];
  let curr = modules;
  for (let i = 0; i < presses; i++) {
    const { low, high, modules: newModules } = pressButton(curr);
    lowTotal += low;
    highTotal += high;
    curr = newModules;
  }

  return lowTotal * highTotal;
}

const pressButton = memoize(
  (
    modules: Record<string, Module>,
    targetModule?: string,
  ): {
    low: number;
    high: number;
    modules: Modules;
    targetSignaled: boolean;
  } => {
    const modulesMut: Modules = JSON.parse(JSON.stringify(modules));
    const queue: PulseEvent[] = modules['broadcaster']!.destinations.map(
      (x) => ({ source: 'broadcaster', target: x, value: -1 }),
    );
    let [low, high] = [1, 0];
    let targetSignaled = false;

    while (queue.length) {
      const { source, target, value } = queue.shift()!;
      if (value < 0) low++;
      else high++;

      if (source === targetModule && target === 'zg' && value > 0) {
        targetSignaled = true;
      }

      if (!modules[target]) continue;
      const { label, type, destinations, memory } = modulesMut[target];
      if (type === 'b') {
        queue.push(
          ...destinations.map((x) => ({ source: label, target: x, value })),
        );
      } else if (type === 'ff' && value < 0) {
        const sendValue = -memory[label];
        memory[label] *= -1;
        queue.push(
          ...destinations.map((x) => ({
            source: label,
            target: x,
            value: sendValue,
          })),
        );
      } else if (type === 'c') {
        memory[source] = value;
        const allHigh = Object.values(memory).every((x) => x === 1);
        queue.push(
          ...destinations.map((x) => ({
            source: label,
            target: x,
            value: allHigh ? -1 : 1,
          })),
        );
      }
    }

    return {
      low,
      high,
      modules: modulesMut,
      targetSignaled,
    };
  },
);

function parseFile(path: string): Modules {
  const lines = readFileSync(path, 'utf-8').split('\n');
  const modules: Modules = {};
  for (const line of lines) {
    const [input, output] = line.split('->').map((x) => x.trim());
    const label = input.replaceAll(/[%&]/g, '');
    let type: ModuleType = 'b';
    if (input.startsWith('%')) type = 'ff';
    if (input.startsWith('&')) type = 'c';
    const destinations = output.split(',').map((x) => x.trim());
    const memory: Record<string, number> = {};
    if (type === 'ff') memory[label] = -1;
    modules[label] = { label, type, destinations, memory };
  }

  for (const { label, destinations } of Object.values(modules)) {
    for (const destination of destinations) {
      if (modules[destination]?.type === 'c') {
        modules[destination].memory[label] = -1;
      }
    }
  }

  return modules;
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-20/example.txt');
const example2 = parseFile('./src/day-20/example2.txt');
const puzzle = parseFile('./src/day-20/puzzle.txt');

timeExecutionMs(() => console.log(countSignals(example)));
timeExecutionMs(() => console.log(countSignals(example2)));
timeExecutionMs(() => console.log(countSignals(puzzle)));

timeExecutionMs(() => console.log(getPressesToRx(puzzle)));
