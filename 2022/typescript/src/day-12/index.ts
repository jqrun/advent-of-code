import { readFileSync } from 'node:fs';

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;

function getShortestPathStartingAtGroundLevel(grid: number[][]): number {
  const dp = [...Array(grid.length)].map(() =>
    [...Array(grid[0].length)].map(() => Number.MAX_VALUE)
  );
  const [rows, cols] = [grid.length, grid[0].length];
  const queue = [];
  let shortest = Number.MAX_VALUE;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] <= 1) {
        queue.push([i, j]);
        dp[i][j] = 0;
      }
    }
  }

  while (queue.length) {
    const [currX, currY] = queue.pop() as [number, number];
    const curr = grid[currX][currY];
    const currCost = dp[currX][currY];

    for (const [xMod, yMod] of DIRS) {
      const x = currX + xMod;
      const y = currY + yMod;
      if (x < 0 || y < 0 || x >= rows || y >= cols) continue;

      const next = grid[x][y];
      const nextCost = dp[x][y];

      const isFinish = next === 27;
      const isStart = curr === 0;
      const cantStep = !isStart && next - curr > 1;
      if (cantStep) continue;

      const newCost = currCost + 1;
      if (newCost >= nextCost) continue;

      if (isFinish) shortest = Math.min(shortest, newCost);

      dp[x][y] = newCost;
      queue.unshift([x, y]);
    }
  }

  return shortest;
}

function getShortestPath(grid: number[][]): number {
  const dp = [...Array(grid.length)].map(() =>
    [...Array(grid[0].length)].map(() => Number.MAX_VALUE)
  );
  const [rows, cols] = [grid.length, grid[0].length];
  const start = [0, 0];
  const queue = [start];
  let shortest = Number.MAX_VALUE;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        start[0] = i;
        start[1] = j;
        break;
      }
    }
  }

  dp[start[0]][start[1]] = 0;

  while (queue.length) {
    const [currX, currY] = queue.pop() as [number, number];
    const curr = grid[currX][currY];
    const currCost = dp[currX][currY];

    for (const [xMod, yMod] of DIRS) {
      const x = currX + xMod;
      const y = currY + yMod;
      if (x < 0 || y < 0 || x >= rows || y >= cols) continue;

      const next = grid[x][y];
      const nextCost = dp[x][y];

      const isFinish = next === 27;
      const cantStep = next - curr > 1;
      if (cantStep) continue;

      const newCost = currCost + 1;
      if (newCost >= nextCost) continue;

      if (isFinish) shortest = Math.min(shortest, newCost);

      dp[x][y] = newCost;
      queue.unshift([x, y]);
    }
  }

  return shortest;
}

function parseFile(path: string): number[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) =>
      x.split('').map((y) => {
        if (y === 'S') return 0;
        if (y === 'E') return 27;
        return y.charCodeAt(0) - 96;
      })
    );
}

const exampleInput = parseFile('./src/day-12/example.txt');
const puzzleInput = parseFile('./src/day-12/puzzle.txt');

console.log(getShortestPath(exampleInput));
console.log(getShortestPath(puzzleInput));

console.log(getShortestPathStartingAtGroundLevel(exampleInput));
console.log(getShortestPathStartingAtGroundLevel(puzzleInput));
