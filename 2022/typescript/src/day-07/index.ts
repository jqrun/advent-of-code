import { readFileSync } from 'node:fs';

interface File {
  size: number;
  name: string;
}

interface Dir {
  size: number;
  children: { [key: string]: Dir | File };
}

function getSmallestToDelete(dir: Dir): number {
  const minDeleteSize = 30_000_000 - (70_000_000 - dir.size);

  let smallest = dir.size;

  const findSmallestEligble = (dir: Dir): void => {
    if (dir.size >= minDeleteSize) smallest = Math.min(smallest, dir.size);

    for (const child of Object.values(dir.children)) {
      if (!isDir(child)) continue;
      findSmallestEligble(child);
    }
  };

  findSmallestEligble(dir);

  return smallest;
}
function getTotalUpTo100K({ children }: Dir): number {
  let total = 0;

  for (const child of Object.values(children)) {
    if (!isDir(child)) continue;

    if (child.size <= 100_000) {
      total += child.size;
    }

    total += getTotalUpTo100K(child);
  }

  return total;
}

function isDir(node: Dir | File): node is Dir {
  return (node as Dir).children !== undefined;
}

function parseFile(path: string): Dir {
  const groups = readFileSync(path, 'utf-8')
    .split('\n$ ls\n')
    .map((x) => x.split('\n'));

  const root: Dir = { size: 0, children: {} };
  const parents: Dir[] = [root];
  let curr = root;

  for (const group of groups.slice(1)) {
    for (const line of group) {
      if (line.startsWith('dir')) {
        curr.children[line.replace('dir ', '')] = { size: 0, children: {} };
      } else if (line.startsWith('$ cd')) {
        const dest = line.replace('$ cd ', '');

        if (dest === '..') {
          const parent = parents.pop();
          if (!parent) throw new Error('No parent to cd into!');

          curr = parent;
        } else {
          parents.push(curr);
          curr = curr.children[dest] as Dir;
        }
      } else {
        const [size, name] = line.split(' ');
        curr.children[name] = { size: Number(size), name };
      }
    }
  }

  sumSizes(root);
  return root;
}

function sumSizes(node: Dir | File): number {
  if (!isDir(node)) return node.size;

  let size = 0;

  for (const child of Object.values(node.children)) {
    size += sumSizes(child);
  }

  node.size = size;
  return size;
}

const exampleInput = parseFile('./src/day-07/example.txt');
const puzzleInput = parseFile('./src/day-07/puzzle.txt');

console.log(getTotalUpTo100K(exampleInput));
console.log(getTotalUpTo100K(puzzleInput));

console.log(getSmallestToDelete(exampleInput));
console.log(getSmallestToDelete(puzzleInput));
