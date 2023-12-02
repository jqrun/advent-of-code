import { readFileSync } from 'node:fs';

const colors = ['red', 'green', 'blue'] as const;

type Color = (typeof colors)[number];
type ColorCount = [Color, number];
type Game = ColorCount[][];

function getPossibleGames(
  games: Game[],
  loading: Record<Color, number>,
): number {
  let sum = 0;
  gameLoop: for (let i = 0; i < games.length; i++) {
    for (const [color, count] of games[i].flat()) {
      if (count > loading[color]) continue gameLoop;
    }
    sum += i + 1;
  }
  return sum;
}

function getMinimalCubeSets(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    const minCounts = { red: 0, green: 0, blue: 0 };
    for (const [color, count] of game.flat()) {
      minCounts[color] = Math.max(minCounts[color], count);
    }
    sum += Object.values(minCounts).reduce((acc, curr) => acc * curr, 1);
  }
  return sum;
}

function parseFile(path: string): Game[] {
  const games = readFileSync(path, 'utf-8')
    .split('\n')
    .map((line) =>
      line
        .replace(/.*:/, '')
        .split(';')
        .map((set) => {
          const counts = set.split(', ').map((x) => {
            const [count, color] = x.trim().split(' ');
            return [color, Number(count)] as ColorCount;
          });
          return counts;
        }),
    );
  return games as Game[];
}

const exampleInput = parseFile('./src/day-02/example.txt');
const puzzleInput = parseFile('./src/day-02/puzzle.txt');

console.log(getPossibleGames(exampleInput, { red: 12, green: 13, blue: 14 }));
console.log(getPossibleGames(puzzleInput, { red: 12, green: 13, blue: 14 }));

console.log(getMinimalCubeSets(exampleInput));
console.log(getMinimalCubeSets(puzzleInput));
