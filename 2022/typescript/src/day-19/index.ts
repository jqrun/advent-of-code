import { readFileSync } from 'node:fs';

type Rock = 'ore' | 'clay' | 'obsidian' | 'geode';

type Cost = Partial<Record<Rock, number>>;

interface Blueprint {
  id: number;
  costs: {
    [key in Rock]: Cost;
  };
}

interface State {
  time: number;
  resources: Record<Rock, number>;
  bots: Record<Rock, number>;
}

const ROCKS: Rock[] = ['geode', 'ore', 'clay', 'obsidian'];

function getTotalQualityFromFirst3(blueprints: Blueprint[]): number {
  return blueprints
    .slice(0, 3)
    .reduce((acc, x) => acc * (getQuality(x, 32) / x.id), 1);
}

function getTotalQuality(blueprints: Blueprint[]): number {
  return blueprints.reduce((acc, x) => acc + getQuality(x), 0);
}

function getQuality(blueprint: Blueprint, totalTime = 24): number {
  let best = 0;
  const cache: Set<string> = new Set();

  const maxNeeded: Record<Rock, number> = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  for (const [, cost] of Object.entries(blueprint.costs)) {
    for (const [rockType, amount] of Object.entries(cost)) {
      maxNeeded[rockType as Rock] = Math.max(
        maxNeeded[rockType as Rock],
        amount
      );
    }
  }

  const crawl = (state: State): void => {
    const serialized = JSON.stringify(state);
    if (cache.has(serialized)) return;
    cache.add(serialized);

    const newResources = { ...state.resources };
    for (const rock of ROCKS) {
      newResources[rock] += state.bots[rock];
    }

    if (state.time >= totalTime) {
      best = Math.max(best, newResources.geode);
      return;
    }

    // Prune if we can't possibly do any better than a prior best.
    const timeLeft = totalTime - state.time;
    const maxImprovement = ((timeLeft - 1) * timeLeft) / 2;
    const remainingGains = state.bots.geode * timeLeft;
    // Manually relaxing the heuristic here until it worked...
    const cannotImprove =
      newResources.geode + remainingGains + maxImprovement + 4 < best;
    if (cannotImprove) return;

    for (const botType of ROCKS) {
      // If we no longer need to build bots of this type.
      if (botType !== 'geode' && maxNeeded[botType] <= state.bots[botType]) {
        continue;
      }

      const canBuildBot = canBuild(state.resources, blueprint.costs[botType]);
      if (canBuildBot) {
        const newState = {
          time: state.time + 1,
          resources: { ...newResources },
          bots: { ...state.bots },
        };

        for (const [costType, amount] of Object.entries(
          blueprint.costs[botType]
        )) {
          newState.resources[costType as Rock] -= amount;
        }
        newState.bots[botType]++;

        crawl(newState);
      }
    }

    crawl({
      time: state.time + 1,
      resources: { ...newResources },
      bots: { ...state.bots },
    });
  };

  crawl({
    time: 1,
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    bots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
  });

  return best * blueprint.id;
}

function canBuild(resources: State['resources'], cost: Cost): boolean {
  return Object.entries(cost).every(
    ([rock, amount]) => resources[rock as Rock] >= amount
  );
}

function parseFile(path: string): Blueprint[] {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((x) => {
      const numbers = x.match(/\d+/g)?.map(Number) as number[];
      return {
        id: numbers[0],
        costs: {
          ore: { ore: numbers[1] },
          clay: { ore: numbers[2] },
          obsidian: { ore: numbers[3], clay: numbers[4] },
          geode: { ore: numbers[5], obsidian: numbers[6] },
        },
      };
    });
}

const exampleInput = parseFile('./src/day-19/example.txt');
const puzzleInput = parseFile('./src/day-19/puzzle.txt');

console.log(getTotalQuality(exampleInput));
console.log(getTotalQuality(puzzleInput));

console.log(getTotalQualityFromFirst3(exampleInput));
console.log(getTotalQualityFromFirst3(puzzleInput));
