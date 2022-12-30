import { readFileSync } from 'node:fs';

type CavePixel = '.' | '#' | 'o';
type Cave = CavePixel[][];

function fillWithSand(caveMutable: Cave, hasBottom = false): number {
  let sand = 0;
  const cave: Cave = JSON.parse(JSON.stringify(caveMutable));
  const rightEdge = cave[0].length - 1;
  const fillMap: Record<string, boolean> = {};

  if (hasBottom) {
    cave.push([...Array(rightEdge + 1)].map(() => '.'));
    cave.push([...Array(rightEdge + 1)].map(() => '#'));
  }

  for (let i = 0; i < cave.length; i++) {
    for (let j = 0; j < cave[0].length; j++) {
      if (cave[i][j] === '#') fillMap[`${i}-${j}`] = true;
    }
  }

  const bottomEdge = cave.length - 1;

  const sandPos = [0, 500];
  const moveSand = (): boolean => {
    const [y, x] = sandPos;

    if (!hasBottom && y >= bottomEdge) return false;

    const downY = y + 1;
    const canMoveDown = hasBottom ? downY < bottomEdge : downY <= bottomEdge;
    if (canMoveDown && !fillMap[`${downY}-${x}`]) {
      sandPos[0]++;
      return true;
    }

    const leftX = x - 1;
    const canMoveLeft = leftX >= 0;
    if (
      canMoveDown &&
      (hasBottom || canMoveLeft) &&
      !fillMap[`${downY}-${leftX}`]
    ) {
      sandPos[0]++;
      sandPos[1]--;
      return true;
    }

    const rightX = x + 1;
    const canMoveRight = rightX <= rightEdge;
    if (
      canMoveDown &&
      (hasBottom || canMoveRight) &&
      !fillMap[`${downY}-${rightX}`]
    ) {
      sandPos[0]++;
      sandPos[1]++;
      return true;
    }

    if (y !== 0 || x !== 500 || cave[0][500] !== 'o') {
      fillMap[`${y}-${x}`] = true;
      sandPos[0] = 0;
      sandPos[1] = 500;
      sand++;

      try {
        cave[y][x] = 'o';
      } catch {
        // Do nothing
      }

      return true;
    }

    return false;
  };

  while (moveSand()) {
    // Do nothing
  }

  console.log(
    cave
      .slice(0, 12)
      .map((x) => x.slice(480).join(''))
      .join('\n')
  );

  return sand;
}

function parseFile(path: string): Cave {
  const lines = readFileSync(path, 'utf-8').split('\n');
  const paths = lines.map((x) =>
    x.split(' -> ').map((y) => y.split(',').map(Number))
  );

  let maxX = 0;
  let maxY = 0;
  console.log(paths);
  for (const path of paths) {
    for (const [x, y] of path) {
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  const cave: Cave = [...Array(maxY + 1)].map(() =>
    [...Array(maxX + 1)].map(() => '.')
  );

  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      const [prevX, prevY] = path[i - 1];
      const [x, y] = path[i];

      if (prevX < x) {
        for (let drawX = prevX; drawX <= x; drawX++) cave[prevY][drawX] = '#';
      } else if (prevX > x) {
        for (let drawX = prevX; drawX >= x; drawX--) cave[prevY][drawX] = '#';
      } else if (prevY > y) {
        for (let drawY = prevY; drawY >= y; drawY--) cave[drawY][prevX] = '#';
      } else if (prevY < y) {
        for (let drawY = prevY; drawY <= y; drawY++) cave[drawY][prevX] = '#';
      }
    }
  }

  return cave;
}

const exampleInput = parseFile('./src/day-14/example.txt');
const puzzleInput = parseFile('./src/day-14/puzzle.txt');

console.log(fillWithSand(exampleInput));
console.log(fillWithSand(puzzleInput));

console.log(fillWithSand(exampleInput, true));
console.log(fillWithSand(puzzleInput, true));
