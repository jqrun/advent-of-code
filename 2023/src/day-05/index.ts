import { readFileSync } from 'node:fs';

function getLowestLocation(alamac: number[][][]): number {
  let sources = alamac[0][0];
  for (const map of alamac.slice(1)) {
    sources = transformSources(sources, map);
  }
  return Math.min(...sources);
}

function getLowestLocationWithRanges(almanac: number[][][]): number {
  let ranges = almanac[0][0];
  for (const map of almanac.slice(1)) {
    ranges = transformRanges(ranges, map);
  }
  return Math.min(...ranges.filter((_, i) => i % 2 === 0));
}

function transformSources(sources: number[], map: number[][]): number[] {
  const transformed = sources.toSorted((a, b) => a - b);
  const sortedMap = map.toSorted((a, b) => a[1] - b[1]);
  let mapIdx = 0;
  transformedLoop: for (let i = 0; i < transformed.length; i++) {
    const curr = transformed[i];

    if (curr < sortedMap[mapIdx][1]) continue;

    while (mapIdx < sortedMap.length) {
      const [dstStart, srcStart, range] = sortedMap[mapIdx];
      const srcEnd = srcStart + range - 1;

      if (curr <= srcEnd) {
        transformed[i] = dstStart + (curr - srcStart);
        continue transformedLoop;
      }
      mapIdx++;
    }

    if (mapIdx >= sortedMap.length) break;
  }
  return transformed;
}

function transformRanges(ranges: number[], map: number[][]): number[] {
  const rangesSorted = ranges
    .reduce((acc, curr, idx, arr) => {
      if (idx % 2 === 0) acc.push(arr.slice(idx, idx + 2));
      return acc;
    }, [] as number[][])
    .toSorted((a, b) => a[0] - b[0]);
  const sortedMap = map.toSorted((a, b) => a[1] - b[1]);
  const newRanges: number[][] = [];

  let mapIdx = 0;
  while (rangesSorted.length) {
    const [start, len] = rangesSorted.shift()!;
    const end = start + len - 1;

    if (end < sortedMap[mapIdx][1]) {
      newRanges.push([start, len]);
      continue;
    }

    while (
      mapIdx < sortedMap.length &&
      start > sortedMap[mapIdx][1] + sortedMap[mapIdx][2] - 1
    ) {
      mapIdx++;
    }

    if (mapIdx >= sortedMap.length) {
      newRanges.push([start, len], ...rangesSorted);
      break;
    }

    const [mDest, mSrc, mRange] = sortedMap[mapIdx];

    if (start < mSrc) {
      newRanges.push([start, mSrc - start]);
      rangesSorted.unshift([mSrc, len - (mSrc - start)]);
      continue;
    }

    const mEnd = mSrc + mRange - 1;
    let transformedLen = len;
    if (end > mEnd) {
      transformedLen = len - (end - mEnd);
      rangesSorted.unshift([mEnd + 1, end - mEnd]);
    }

    const delta = mDest - mSrc;
    newRanges.push([start + delta, transformedLen]);
  }

  return newRanges.flat();
}

function parseFile(path: string): number[][][] {
  return readFileSync(path, 'utf-8')
    .split(/\s*.*:\s+/)
    .filter(Boolean)
    .map((x) => x.split('\n').map((y) => y.split(' ').map(Number)));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const exampleInput = parseFile('./src/day-05/example.txt');
const puzzleInput = parseFile('./src/day-05/puzzle.txt');

timeExecutionMs(() => console.log(getLowestLocation(exampleInput)));
timeExecutionMs(() => console.log(getLowestLocation(puzzleInput)));

timeExecutionMs(() => console.log(getLowestLocationWithRanges(exampleInput)));
timeExecutionMs(() => console.log(getLowestLocationWithRanges(puzzleInput)));
