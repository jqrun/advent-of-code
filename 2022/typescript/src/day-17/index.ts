import { readFileSync } from 'node:fs';

type X = number;
type Y = number;
type Coord = [Y, X];
type Jet = '<' | '>';

type Rock = Coord[];

const ROCKS: Rock[] = [
  // -
  [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ],
  // +
  [
    [0, 3],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
  ],
  // J
  [
    [0, 4],
    [1, 4],
    [2, 2],
    [2, 3],
    [2, 4],
  ],
  // |
  [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  // o
  [
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
  ],
];

const JET_MAP = {
  '>': 1,
  '<': -1,
} as const;

function simulateRocks(jets: Jet[], rounds = 2022): number {
  const chamber: string[][] = [getNewChamberRow()];
  const cacheRows = 50;
  let addedCycleHeight = 0;
  let doneCycling = false;

  const cache: Record<string, [number, number]> = {};
  const getCacheKey = (
    rockIndex: number,
    jetIndex: number,
    chamber: string[][]
  ): string => {
    return (
      `${rockIndex}-${jetIndex}` + JSON.stringify(chamber.slice(0, cacheRows))
    );
  };

  let rockIndex = 0;
  let jetIndex = 0;
  let round = 1;
  while (round <= rounds) {
    const rock: Coord[] = JSON.parse(JSON.stringify(ROCKS[rockIndex]));
    const rockHeight = rock.slice(-1)[0][0] + 1;

    // Correct empty space
    (() => {
      let spaceAboveTallest = 0;
      for (const row of chamber) {
        if (row.every((x) => x === '.')) spaceAboveTallest++;
        else break;
      }

      for (; spaceAboveTallest < rockHeight + 3; spaceAboveTallest++) {
        chamber.unshift(getNewChamberRow());
      }
    })();

    while (true) {
      // Jet adjustment
      const jet = jets[jetIndex];
      jetIndex = (jetIndex + 1) % jets.length;

      const modX = JET_MAP[jet];

      const canAdjust = rock.every(([y, x]) => {
        const adjusted: number = x + modX;
        return adjusted >= 0 && adjusted < 7 && chamber[y][adjusted] !== '#';
      });

      if (canAdjust) {
        rock.forEach((coord) => (coord[1] += modX));
      }

      // Fall down
      const canFallDown = rock.every(([y, x]) => {
        return y < chamber.length - 1 && chamber[y + 1][x] !== '#';
      });
      if (canFallDown) {
        rock.forEach((coord) => coord[0]++);
      } else {
        rock.forEach(([y, x]) => {
          chamber[y][x] = '#';
        });
        break;
      }
    }

    while (chamber[0].every((x) => x === '.')) chamber.shift();
    const chamberHeight = chamber.length;

    if (!doneCycling) {
      const cacheKey = getCacheKey(rockIndex, jetIndex, chamber);
      if (cacheKey in cache) {
        const [prevRound, prevHeight] = cache[cacheKey];
        const cycleLength = round - prevRound;
        const cycleHeight = chamberHeight - prevHeight;

        const remaining = rounds - round;
        const cycles = Math.floor(remaining / cycleLength);
        addedCycleHeight = cycles * cycleHeight;
        round += cycleLength * cycles;

        doneCycling = true;
      } else {
        cache[cacheKey] = [round, chamberHeight];
      }
    }

    rockIndex = (rockIndex + 1) % ROCKS.length;
    round++;
  }

  return chamber.length + addedCycleHeight;
}

function getNewChamberRow(): string[] {
  return [...Array(7)].map(() => '.');
}

function parseFile(path: string): Jet[] {
  return readFileSync(path, 'utf-8').split('') as Jet[];
}

const exampleInput = parseFile('./src/day-17/example.txt');
const puzzleInput = parseFile('./src/day-17/puzzle.txt');

console.log(simulateRocks(exampleInput));
console.log(simulateRocks(puzzleInput));

console.log(simulateRocks(exampleInput, 1_000_000_000_000));
console.log(simulateRocks(puzzleInput, 1_000_000_000_000));
