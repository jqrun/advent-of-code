import { readFileSync } from 'node:fs';

interface Guide {
  seq: string;
  nodes: Record<string, string[]>;
}

const STEP_MAP: Record<string, number> = { L: 0, R: 1 };

function countSteps({ seq, nodes }: Guide): number {
  let [curr, seqIdx, steps] = ['AAA', 0, 0];
  while (curr !== 'ZZZ') {
    curr = nodes[curr][STEP_MAP[seq[seqIdx]]];
    seqIdx = (seqIdx + 1) % seq.length;
    steps++;
  }
  return steps;
}

function countGhostSTeps({ seq, nodes }: Guide): number {
  const starts = Object.keys(nodes).filter((x) => x[2] === 'A');
  const stepsToZ = Array(starts.length).fill(0);
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];

    let [curr, seqIdx, steps] = [start, 0, 0];
    while (true) {
      curr = nodes[curr][STEP_MAP[seq[seqIdx]]];
      seqIdx = (seqIdx + 1) % seq.length;
      steps++;
      if (curr.endsWith('Z')) {
        stepsToZ[i] = steps;
        break;
      }
    }
  }
  return leastCommonMultiple(stepsToZ);
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

function parseFile(path: string): Guide {
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean);
  const seq = lines[0];
  const nodes: Guide['nodes'] = {};
  for (const line of lines.slice(1)) {
    const parts = line.split(/\W+/);
    nodes[parts[0]] = parts.slice(1, 3);
  }
  return { seq, nodes };
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example1Input = parseFile('./src/day-08/example1.txt');
const example2Input = parseFile('./src/day-08/example2.txt');
const example3Input = parseFile('./src/day-08/example3.txt');
const puzzleInput = parseFile('./src/day-08/puzzle.txt');

timeExecutionMs(() => console.log(countSteps(example1Input)));
timeExecutionMs(() => console.log(countSteps(example2Input)));
timeExecutionMs(() => console.log(countSteps(puzzleInput)));

timeExecutionMs(() => console.log(countGhostSTeps(example3Input)));
timeExecutionMs(() => console.log(countGhostSTeps(puzzleInput)));
