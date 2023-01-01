import { readFileSync } from 'node:fs';

interface Num {
  value: number;
  id: number;
}

function sumGrooveCoordinates(numsMutabe: Num[], key = 1, mixes = 1): number {
  const nums = [...numsMutabe];
  nums.forEach((num) => (num.value *= key));

  const original = [...nums];

  for (let mix = 1; mix <= mixes; mix++) {
    for (const { value, id } of original) {
      if (!value) continue;

      for (let i = 0; i < nums.length; i++) {
        if (nums[i].value === value && nums[i].id === id) {
          nums.splice(i, 1);
          nums.splice((i + value) % nums.length, 0, { value, id });
          break;
        }
      }
    }
  }

  let startIndex = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i].value === 0) {
      startIndex = i;
      break;
    }
  }

  const coords = [1000, 2000, 3000].map((x) => {
    return nums[(startIndex + x) % nums.length].value;
  });

  return coords.reduce((acc, x) => acc + x, 0);
}

// function wrapIndex(arr: number[], i: number): number {
//   const len = arr.length;
//   return ((i % len) + len) % len;
// }

// function swap(arr: number[], i: number, j: number): void {
//   const tmp = arr[i];
//   arr[i] = arr[j];
//   arr[j] = tmp;
// }

function parseFile(path: string): Num[] {
  const counts: Record<number, number> = {};

  return readFileSync(path, 'utf-8')
    .split('\n')
    .map(Number)
    .map((x) => {
      counts[x] = (counts[x] ?? 0) + 1;

      return {
        value: x,
        id: counts[x] - 1,
      };
    });
}

const exampleInput = parseFile('./src/day-20/example.txt');
const puzzleInput = parseFile('./src/day-20/puzzle.txt');

console.log(sumGrooveCoordinates(exampleInput));
console.log(sumGrooveCoordinates(puzzleInput));

console.log(sumGrooveCoordinates(exampleInput, 811_589_153, 10));
console.log(sumGrooveCoordinates(puzzleInput, 811_589_153, 10));
