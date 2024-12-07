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


def get_next(y, x, grid, rows, cols, dir, default=""):
    new_y, new_x = y + dir[0], x + dir[1]
    if not in_bounds(new_y, new_x, rows, cols):
        return default
    return grid[y + dir[0]][x + dir[1]]


def get_path_length(grid):
    rows, cols = len(grid), len(grid[0])
    y, x = find_start(grid)

    seen = set()
    dir_index = 0
    while in_bounds(y, x, rows, cols):
        seen.add((y, x))
        while get_next(y, x, grid, rows, cols, DIRS[dir_index]) == "#":
            dir_index = (dir_index + 1) % 4
        y += DIRS[dir_index][0]
        x += DIRS[dir_index][1]

    return len(seen)


def is_loop(grid, obstacle):
    rows, cols = len(grid), len(grid[0])
    y, x = find_start(grid)
    oy, ox = obstacle
    pre_obstacle = grid[oy][ox]
    grid[oy][ox] = "#"

    visited = set()
    dir_index = 0
    while in_bounds(y, x, rows, cols):
        while get_next(y, x, grid, rows, cols, DIRS[dir_index]) == "#":
            dir_index = (dir_index + 1) % 4

        if (y, x, dir_index) in visited:
            grid[oy][ox] = pre_obstacle
            return True

        visited.add((y, x, dir_index))
        y += DIRS[dir_index][0]
        x += DIRS[dir_index][1]

    grid[oy][ox] = pre_obstacle
    return False


def get_potential_loops(grid):
    rows, cols = len(grid), len(grid[0])
    start_y, start_x = find_start(grid)
    y, x = start_y, start_x

    potential_loops = set()
    dir_index = 0
    while in_bounds(y, x, rows, cols):
        if (y, x) != (start_y, start_x) and is_loop(grid, (y, x)):
            potential_loops.add((y, x))

        while get_next(y, x, grid, rows, cols, DIRS[dir_index]) == "#":
            dir_index = (dir_index + 1) % 4
        y += DIRS[dir_index][0]
        x += DIRS[dir_index][1]

    return len(potential_loops)


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_06_example.txt")
puzzle = parse_file("./inputs/day_06_puzzle.txt")

common.time_and_print(get_path_length, example)
common.time_and_print(get_path_length, puzzle)

common.time_and_print(get_potential_loops, example)
common.time_and_print(get_potential_loops, puzzle)
