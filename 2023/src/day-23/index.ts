import { readFileSync } from 'node:fs';

const DIRS: Record<string, number[]> = {
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

function getLongestDryHike(grid: string[][]): number {
  const [height, width] = [grid.length, grid[0].length];
  const { adjList, edges } = buildGraph(grid);
  const longest: Record<string, number> = {};
  const start = JSON.stringify([0, 1]);
  const stack: [string, number, Set<string>][] = [[start, 0, new Set([start])]];

  while (stack.length) {
    const [node, len, visited] = stack.pop()!;

    for (const neighbor of adjList[node]) {
      if (visited.has(neighbor)) continue;

      const newLen = len + edges[node][neighbor];
      stack.push([neighbor, newLen, new Set([...visited, neighbor])]);
      longest[neighbor] = Math.max(longest[neighbor] ?? 0, newLen);
    }
  }

  return longest[JSON.stringify([height - 1, width - 2])] ?? 0;
}

function buildGraph(grid: string[][]): {
  adjList: Record<string, Set<string>>;
  edges: Record<string, Record<string, number>>;
} {
  const [height, width] = [grid.length, grid[0].length];
  const [start, end] = [
    [0, 1],
    [height - 1, width - 2],
  ].map((x) => JSON.stringify(x));
  const nodes: Set<string> = new Set([start, end]);
  const adjList: Record<string, Set<string>> = {};
  const edges: Record<string, Record<string, number>> = {};
  const stack: [number, number, number, string, Set<string>][] = [
    [0, 1, 0, start, new Set([start])],
  ];

  for (let sy = 0; sy < height; sy++) {
    for (let sx = 0; sx < width; sx++) {
      if (grid[sy][sx] === '#') continue;
      let branches = 0;
      for (const [dy, dx] of Object.values(DIRS)) {
        const [y, x] = [sy + dy, sx + dx];
        if (y < 0 || y >= height || x < 0 || x >= width) continue;
        const cell = grid[y][x];
        if (cell === '#') continue;
        branches++;
      }
      if (branches > 2) nodes.add(JSON.stringify([sy, sx]));
    }
  }

  while (stack.length) {
    const [sy, sx, len, node, visited] = stack.pop()!;

    const prevCell = grid[sy][sx];

    let dirs = [];
    if (DIRS[prevCell]) dirs.push(DIRS[prevCell]);
    else dirs = Object.values(DIRS);
    for (const [dy, dx] of dirs) {
      const [y, x] = [sy + dy, sx + dx];
      if (y < 0 || y >= height || x < 0 || x >= width) continue;

      const cell = grid[y][x];
      if (cell === '#') continue;

      const key = JSON.stringify([y, x]);
      if (visited.has(key)) continue;
      visited.add(key);

      let newLen = len + 1;
      let newNode = node;
      if (nodes.has(key)) {
        adjList[node] ??= new Set();
        adjList[node].add(key);

        edges[node] ??= {};
        edges[key] ??= {};
        edges[node][key] = Math.max(newLen, edges[node][key] ?? 0);
        edges[key][node] = Math.max(newLen, edges[key][node] ?? 0);
      }

      if (nodes.has(JSON.stringify([sy, sx]))) {
        newNode = JSON.stringify([sy, sx]);
        newLen = 1;
      }
      stack.push([y, x, newLen, newNode, new Set([...visited, key])]);
    }
  }

  for (const [node, adjSet] of Object.entries(adjList)) {
    for (const neighbor of adjSet) {
      adjList[neighbor] ??= new Set();
      adjList[neighbor].add(node);
    }
  }

  return { adjList, edges };
}

function getLongestHike(grid: string[][]): number {
  const [height, width] = [grid.length, grid[0].length];
  const longest: number[][] = [...Array(height)].map(() =>
    Array(width).fill(0),
  );
  const stack: [number, number, Set<string>][] = [
    [0, 1, new Set([JSON.stringify([0, 1])])],
  ];

  while (stack.length) {
    const [sy, sx, visited] = stack.pop()!;
    const prevCell = grid[sy][sx];
    let branches = [];
    if (DIRS[prevCell]) branches.push(DIRS[prevCell]);
    else branches = Object.values(DIRS);

    for (const [dy, dx] of branches) {
      const [y, x] = [sy + dy, sx + dx];
      if (y < 0 || y >= height || x < 0 || x >= width) continue;

      const cell = grid[y][x];
      if (cell === '#') continue;

      const key = JSON.stringify([y, x]);
      if (visited.has(key)) continue;

      if (longest[y][x] >= 1 + longest[sy][sx]) continue;
      longest[y][x] = 1 + longest[sy][sx];
      stack.push([y, x, new Set([...visited, key])]);
    }
  }

  return longest[height - 1][width - 2];
}

function parseFile(path: string): string[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(''));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

const example = parseFile('./src/day-23/example.txt');
const puzzle = parseFile('./src/day-23/puzzle.txt');

timeExecutionMs(() => console.log(getLongestHike(example)));
timeExecutionMs(() => console.log(getLongestHike(puzzle)));

timeExecutionMs(() => console.log(getLongestDryHike(example)));
timeExecutionMs(() => console.log(getLongestDryHike(puzzle)));
