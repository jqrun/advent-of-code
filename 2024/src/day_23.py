import common
from typing import Generator


def get_pairs(iterable: set[str]) -> Generator[tuple[str], None, None]:
    pool, length = tuple(iterable), len(iterable)
    for i in range(length):
        for j in range(i + 1, length):
            yield (pool[i], pool[j])


def find_trio_ts(edges: dict[str, set[str]]) -> int:
    trios: str[tuple(str, ...)] = set()
    for a, connected in edges.items():
        if len(connected) < 2:
            continue
        for b, c in get_pairs(connected):
            key = tuple(sorted([a, b, c]))
            if key not in trios and c in edges[b] and b in edges[c]:
                trios.add(key)

    count = 0
    for trio in trios:
        count += 1 if any([x.startswith("t") for x in trio]) else 0
    return count


def get_password(edges: dict[str, set[str]]) -> str:
    nodes = set(edges.keys())

    pools = []
    for node in nodes:
        joined = False
        for pool in pools:
            if all([x in edges[node] for x in pool]):
                pool.add(node)
                joined = True
        if not joined:
            pools.append(set([node]))

    pools.sort(key=lambda x: len(x))
    return ",".join(sorted(pools[-1]))


def parse_file(path) -> dict[str, set[str]]:
    pair_list = [x.split("-") for x in common.open_relative_path(path).split("\n")]
    edges = {}
    for i, j in pair_list:
        if i not in edges:
            edges[i] = set()
        if j not in edges:
            edges[j] = set()
        edges[i].add(j)
        edges[j].add(i)
    return edges


example = parse_file("./inputs/day_23_example.txt")
puzzle = parse_file("./inputs/day_23_puzzle.txt")

common.time_and_print(find_trio_ts, example)
common.time_and_print(find_trio_ts, puzzle)

common.time_and_print(get_password, example)
common.time_and_print(get_password, puzzle)
