import common
from heapq import heapify, heappush, heappop

DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]


def find_val(grid: list[list[str]], val: str) -> tuple[int, int]:
    for y in range(len(grid)):
        for x, cell in enumerate(grid[y]):
            if cell == val:
                return (y, x)

    return (-1, -1)


def get_lowest_possible_points(grid: list[list[str]]) -> int:
    start, end = find_val(grid, "S"), find_val(grid, "E")

    pq = [(0, start, 1)]
    visited: set[tuple[tuple[int, int], int]] = set()

    while len(pq):
        points, (y, x), dir_index = heappop(pq)
        if (y, x) == end:
            return points

        visited_key = ((y, x), dir_index)
        if visited_key in visited:
            continue
        visited.add(visited_key)

        facing = DIRS[dir_index]
        forward = (y + facing[0], x + facing[1])
        if grid[forward[0]][forward[1]] != "#":
            heappush(pq, (points + 1, forward, dir_index))

        turns = [(dir_index + 1) % 4, (dir_index - 1) % 4]
        for turn_index in turns:
            turn = DIRS[turn_index]
            if grid[y + turn[0]][x + turn[1]] != "#":
                heappush(pq, (points + 1000, (y, x), turn_index))

    return -1


def count_tiles_on_best_paths(grid: list[list[str]]) -> int:
    best_points = get_lowest_possible_points(grid)
    start, end = find_val(grid, "S"), find_val(grid, "E")
    tiles: set[tuple[int, int]] = set()

    pq: list[tuple[int, tuple[int, int], int, set[tuple[int, int, int]]]] = [
        (0, start, 1, set())
    ]

    points_map: dict[tuple[int, int, int], int] = {}

    while len(pq):
        points, (y, x), dir_index, visited = heappop(pq)

        points_map_key = (y, x, dir_index)
        if points_map_key not in points_map:
            points_map[points_map_key] = points
        elif points > points_map[points_map_key]:
            continue

        visited = visited.copy()
        visited_key = (y, x, dir_index)
        if visited_key in visited:
            continue
        visited.add(visited_key)

        if (y, x) == end:
            for record in visited:
                tiles.add((record[0], record[1]))

        if points >= best_points:
            continue

        facing = DIRS[dir_index]
        forward = (y + facing[0], x + facing[1])
        if grid[forward[0]][forward[1]] != "#":
            heappush(pq, (points + 1, forward, dir_index, visited))

        if points + 1000 >= best_points:
            continue

        turns = [(dir_index + 1) % 4, (dir_index - 1) % 4]
        for turn_index in turns:
            turn = DIRS[turn_index]
            if grid[y + turn[0]][x + turn[1]] != "#":
                heappush(pq, (points + 1000, (y, x), turn_index, visited))

    return len(tiles)


def parse_file(path: str) -> list[list[str]]:
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_16_example.txt")
puzzle = parse_file("./inputs/day_16_puzzle.txt")

common.time_and_print(get_lowest_possible_points, example)
common.time_and_print(get_lowest_possible_points, puzzle)

common.time_and_print(count_tiles_on_best_paths, example)
common.time_and_print(count_tiles_on_best_paths, puzzle)
