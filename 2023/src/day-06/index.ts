import { readFileSync } from 'node:fs';

function getMergedRaceWins(races: number[][]): number {
  let [time, record] = ['', ''];
  for (const race of races) {
    time += String(race[0]);
    record += String(race[1]);
  }
  return getTotalPossibleWins([[Number(time), Number(record)]]);
}

function getTotalPossibleWins(races: number[][]): number {
  let total = 1;
  for (const [time, record] of races) {
    total *= getPossibleWins(time, record);
  }

  return total;
}

function getPossibleWins(time: number, record: number): number {
  const peak = Math.floor(time / 2);
  let [left, right, found] = [0, peak, 0];
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = getTotalDist(mid, time);

    if (
      midVal > record &&
      (mid === 0 || getTotalDist(mid - 1, time) <= record)
    ) {
      found = mid;
      break;
    } else if (midVal <= record) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return time - 2 * found + 1;
}

function getTotalDist(hold: number, time: number): number {
  return (time - hold) * hold;
}

function parseFile(path: string): number[][] {
  const lines = readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) => line.split(/\D+/).slice(1).map(Number));
  const merged = [];
  for (let i = 0; i < lines[0].length; i++) {
    merged.push([lines[0][i], lines[1][i]]);
  }
  return merged;
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-06/example.txt');
const puzzleInput = parseFile('./src/day-06/puzzle.txt');

timeExecutionMs(() => console.log(getTotalPossibleWins(exampleInput)));
timeExecutionMs(() => console.log(getTotalPossibleWins(puzzleInput)));

timeExecutionMs(() => console.log(getMergedRaceWins(exampleInput)));
timeExecutionMs(() => console.log(getMergedRaceWins(puzzleInput)));
