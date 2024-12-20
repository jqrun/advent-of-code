import common


def get_combination_pairs(iterable):
    pool = tuple(iterable)
    for i in range(len(pool)):
        for j in range(i + 1, len(pool)):
            yield (pool[i], pool[j])


def get_cheats_under(grid: dict[complex, str], savings=100, cheat_dist=2) -> int:
    (start,) = (p for p in grid if grid[p] == "S")

    dist = {start: 0}
    crawl = [start]
    for pos in crawl:
        for next in pos - 1, pos + 1, pos - 1j, pos + 1j:
            if next in grid and next not in dist:
                dist[next] = dist[pos] + 1
                crawl.append(next)

    cheats = 0
    for (p, i), (q, j) in get_combination_pairs(list(dist.items())):
        man_dist = abs((p - q).real) + abs((p - q).imag)
        if man_dist <= cheat_dist and j - i - man_dist >= savings:
            cheats += 1
    return cheats


def parse_file(path) -> dict[complex, str]:
    return {
        i + j * 1j: cell
        for i, row in enumerate(common.open_relative_path(path).splitlines())
        for j, cell in enumerate(row)
        if cell != "#"
    }


example = parse_file("./inputs/day_20_example.txt")
puzzle = parse_file("./inputs/day_20_puzzle.txt")


common.time_and_print(get_cheats_under, example, savings=1)
common.time_and_print(get_cheats_under, puzzle, savings=100)

common.time_and_print(get_cheats_under, example, savings=50, cheat_dist=20)
common.time_and_print(get_cheats_under, puzzle, savings=100, cheat_dist=20)
