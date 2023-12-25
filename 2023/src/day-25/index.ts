import { readFileSync } from 'node:fs';

function splitIntoGroups(connections: string[][]): number {
  const adjList: Record<string, Set<string>> = {};
  const nodes = new Set<string>();
  const freq: Record<string, number> = {};

  for (const [a, ...rest] of connections) {
    for (const b of rest) {
      adjList[a] ??= new Set<string>();
      adjList[b] ??= new Set<string>();
      adjList[a].add(b);
      adjList[b].add(a);
      nodes.add(a);
      nodes.add(b);
    }
  }

  for (const node of nodes) {
    const queue: string[] = [node];
    const visited = new Set<string>(queue);

    while (queue.length) {
      const curr = queue.shift()!;
      for (const neighbor of adjList[curr]) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
        const key = JSON.stringify([curr, neighbor].toSorted());
        freq[key] ??= 0;
        freq[key]++;
      }
    }
  }

  const top3Edges = Object.entries(freq)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [edge] of top3Edges) {
    const [a, b] = JSON.parse(edge) as string[];
    adjList[a].delete(b);
    adjList[b].delete(a);
  }

  const queue: string[] = [[...nodes][0]];
  const visited = new Set<string>(queue);
  let size = 1;
  while (queue.length) {
    const curr = queue.shift()!;
    for (const neighbor of adjList[curr]) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
      size++;
    }
  }

  return size * (nodes.size - size);
}

function parseFile(path: string): string[][] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => x.split(/[\s:]/).filter(Boolean));
}

function timeExecutionMs(fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(4)}ms\n`);
}

// This brute force method doesn't work for the sample input :)
// const example = parseFile('./src/day-25/example.txt');
const puzzle = parseFile('./src/day-25/puzzle.txt');

// timeExecutionMs(() => console.log(splitIntoGroups(example)));
timeExecutionMs(() => console.log(splitIntoGroups(puzzle)));
