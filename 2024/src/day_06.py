import common

DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]


def find_start(grid):
    for y, row in enumerate(grid):
        for x, char in enumerate(row):
            if char == "^":
                return (y, x)
    return (-1, -1)


def in_bounds(y, x, rows, cols):
    return y >= 0 and y < rows and x >= 0 and x < cols


def get_next(y, x, grid, dir, default=""):
    try:
        return grid[y + dir[0]][x + dir[1]]
    except:
        return default


def get_path_length(grid):
    rows, cols = len(grid), len(grid[0])
    y, x = find_start(grid)

    seen = set([y, x])
    dir_index = 0
    while in_bounds(y, x, rows, cols):
        while get_next(y, x, grid, DIRS[dir_index]) == "#":
            dir_index = (dir_index + 1) % 4
        y += DIRS[dir_index][0]
        x += DIRS[dir_index][1]
        seen.add((y, x))

    return len(seen)


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_06_example.txt")
puzzle = parse_file("./inputs/day_06_puzzle.txt")

common.time_and_print(get_path_length, example)
# common.time_and_print(get_path_length, puzzle)
