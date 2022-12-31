import { readFileSync } from 'node:fs';

interface Valve {
  flow: number;
  leadsTo: string[];
}

type ValveMap = Record<string, Valve>;

type ValveCosts = Record<string, Record<string, number>>;

function getMaxPressureWithHelp(map: ValveMap): number {
  const costs = getValveCosts(map);
  const valves = Object.keys(costs).filter((x) => x !== 'AA');
  const combinations = Math.pow(2, valves.length - 1);
  const binPadding = combinations.toString(2).length;

  let max = getMaxPressureWithTargetOpens(new Set(['AA', ...valves]), map);

  for (let i = 1; i <= combinations; i++) {
    const bin = i.toString(2).padStart(binPadding, '0').split('');
    const setA: string[] = [...valves];
    const setB: string[] = [];

    // Heuristic optimization, assuming it will never be too lopsided.
    const numInSetA = bin.reduce((acc, x) => (x === '1' ? acc + 1 : acc), 0);
    if (numInSetA < valves.length / 2) {
      continue;
    }

    for (let i = bin.length - 1; i >= 0; i--) {
      const bit = bin[i];
      if (bit === '0') {
        setB.push(setA.splice(i, 1)[0]);
      }
    }

    setA.push('AA');
    setB.push('AA');
    const me = getMaxPressureWithTargetOpens(new Set(setA), map);
    const elephant = getMaxPressureWithTargetOpens(new Set(setB), map);

    max = Math.max(max, me + elephant);
  }

  return max;
}

function getMaxPressureWithTargetOpens(
  targetOpens: Set<string>,
  map: ValveMap,
  time = 26
): number {
  let max = 0;
  const costs = getValveCosts(map);

  const crawl = (
    current = 'AA',
    timeLeft = time,
    opened: Set<string> = new Set(['AA']),
    rate = 0,
    total = 0
  ): void => {
    const totalIfStaying = total + timeLeft * rate;
    max = Math.max(max, totalIfStaying);

    for (const [valve, cost] of Object.entries(costs[current])) {
      if (opened.has(valve)) continue;
      if (!targetOpens.has(valve)) continue;

      const costWithOpen = cost + 1;
      const newTime = timeLeft - costWithOpen;
      if (newTime < 0) continue;

      crawl(
        valve,
        newTime,
        new Set([...opened, valve]),
        rate + map[valve].flow,
        total + rate * costWithOpen
      );
    }
  };

  crawl();

  return max;
}

function getMaxPressure(map: ValveMap, time = 30): number {
  let max = 0;
  const costs = getValveCosts(map);

  const crawl = (
    current = 'AA',
    timeLeft = time,
    opened: Set<string> = new Set(['AA']),
    rate = 0,
    total = 0
  ): void => {
    const totalIfStaying = total + timeLeft * rate;
    max = Math.max(max, totalIfStaying);

    for (const [valve, cost] of Object.entries(costs[current])) {
      if (opened.has(valve)) continue;

      const costWithOpen = cost + 1;
      const newTime = timeLeft - costWithOpen;
      if (newTime < 0) continue;

      crawl(
        valve,
        newTime,
        new Set([...opened, valve]),
        rate + map[valve].flow,
        total + rate * costWithOpen
      );
    }
  };

  crawl();

  return max;
}

function getValveCosts(map: ValveMap): ValveCosts {
  const costs: ValveCosts = {};
  const finishedOrigins: Set<string> = new Set();

  for (const [id, { flow }] of Object.entries(map)) {
    if (flow || id === 'AA') costs[id] = {};
  }

  const bfs = (origin = 'AA'): void => {
    let queue: string[] = [origin];
    const visited: Set<string> = new Set();

    let steps = 0;
    while (queue.length) {
      const nextRound = [];

      for (const current of queue) {
        if (visited.has(current)) continue;
        visited.add(current);

        if (current !== origin && current in costs) {
          costs[origin][current] = Math.min(
            steps,
            costs[origin][current] ?? Number.MAX_VALUE
          );
        }

        for (const nextValve of map[current].leadsTo) {
          nextRound.push(nextValve);
        }
      }

      steps++;
      queue = nextRound;
    }

    finishedOrigins.add(origin);
  };

  for (const origin of Object.keys(costs)) {
    bfs(origin);
  }

  return costs;
}

function parseFile(path: string): ValveMap {
  const lines = readFileSync(path, 'utf-8').split('\n');
  const map: ValveMap = {};

  for (const line of lines) {
    const edit = line
      .replace('Valve ', '')
      .replace(' has flow rate=', ';')
      .replace('; tunnels lead to valves ', ';')
      .replace('; tunnel leads to valve ', ';')
      .replaceAll(' ', '');

    const [valve, flow, leadsTo] = edit.split(';');

    map[valve] = {
      flow: Number(flow),
      leadsTo: leadsTo.split(','),
    };
  }

  return map;
}

const exampleInput = parseFile('./src/day-16/example.txt');
const puzzleInput = parseFile('./src/day-16/puzzle.txt');

console.log(getMaxPressure(exampleInput));
console.log(getMaxPressure(puzzleInput));

console.log(getMaxPressureWithHelp(exampleInput));
console.log(getMaxPressureWithHelp(puzzleInput));
