import common


def can_fit(key: list[int], lock: list[int]) -> bool:
    return not any([(key[i] + lock[i]) > 5 for i in range(len(key))])


def get_possible_pairs(keys: set[tuple[int, ...]], locks: set[tuple[int, ...]]) -> int:
    count = 0
    for key in keys:
        for lock in locks:
            count += 1 if can_fit(key, lock) else 0

    return count


def parse_file(path) -> tuple[set[tuple[int, ...]], set[tuple[int, ...]]]:
    grids = [x.splitlines() for x in common.open_relative_path(path).split("\n\n")]
    keys = set()
    locks = set()
    for grid in grids:
        cols = [-1] * 5
        for row in grid:
            for i, val in enumerate(row):
                cols[i] += 1 if val == "#" else 0
        (keys if grid[0].startswith(".") else locks).add(tuple(cols))

    return (keys, locks)


example = parse_file("./inputs/day_25_example.txt")
puzzle = parse_file("./inputs/day_25_puzzle.txt")

common.time_and_print(get_possible_pairs, *example)
common.time_and_print(get_possible_pairs, *puzzle)
