import { readFileSync } from 'node:fs';

type NestedArray<T> = Array<T | NestedArray<T>>;
type Packet = NestedArray<number>;
type Pair = [Packet, Packet];
type OrderResult = 'pass' | 'fail' | 'tie';

function orderAndLocate(pairs: Pair[]): number {
  const flattened = pairs.flat();
  flattened.push([[2]], [[6]]);
  flattened.sort((a, b) => {
    const result = isInOrder(a, b);
    if (result === 'tie') return 0;
    if (result === 'pass') return -1;
    return 1;
  });

  let first = 0;
  let second = 0;

  for (let i = 0; i < flattened.length; i++) {
    if (JSON.stringify(flattened[i]) === '[[2]]') first = i + 1;
    if (JSON.stringify(flattened[i]) === '[[6]]') second = i + 1;
  }

  return first * second;
}

function getPacketsInOrder(pairs: Pair[]): number {
  return pairs.reduce(
    (acc, x, i) => acc + (isInOrder(...x) === 'pass' ? i + 1 : 0),
    0
  );
}

function isInOrder(a: Packet | number, b: Packet | number): OrderResult {
  const [aIsArray, bIsArray] = [a, b].map(isArray);

  if (!aIsArray && !bIsArray) {
    if (a === b) return 'tie';
    return a < b ? 'pass' : 'fail';
  }

  if (aIsArray && bIsArray) {
    const [aLen, bLen] = [a, b].map((x) => (x as Packet).length);
    if (aLen && !bLen) return 'fail';

    for (let i = 0; i < (a as Packet).length; i++) {
      const result = isInOrder((a as Packet)[i], (b as Packet)[i]);
      if (result === 'tie') continue;
      return result;
    }

    if (aLen === bLen) return 'tie';
  }

  if (!aIsArray) return isInOrder([a], b);
  if (!bIsArray) return isInOrder(a, [b]);

  return 'pass';
}

function isArray(packet: Packet | number): packet is Array<number> {
  return typeof packet === 'object';
}

function parseFile(path: string): Pair[] {
  return readFileSync(path, 'utf-8')
    .split('\n\n')
    .map((x) => x.split('\n').map((x) => JSON.parse(x) as Packet) as Pair);
}

const exampleInput = parseFile('./src/day-13/example.txt');
const puzzleInput = parseFile('./src/day-13/puzzle.txt');

console.log(getPacketsInOrder(exampleInput));
console.log(getPacketsInOrder(puzzleInput));

console.log(orderAndLocate(exampleInput));
console.log(orderAndLocate(puzzleInput));
