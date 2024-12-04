import common

DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
MAS_DIRS = [(-1, -1), (-1, 1), (1, -1), (1, 1)]


def is_xmas(grid, start_y, start_x, delta_y, delta_x, max_y, max_x):
    if grid[start_y][start_x] != "X":
        return False

    y, x = start_y, start_x
    match = "MAS"
    for i in range(3):
        y, x = y + delta_y, x + delta_x
        if y < 0 or y >= max_y or x < 0 or x >= max_x:
            return False
        if grid[y][x] != match[i]:
            return False

    return True


def count_xmas(grid):
    rows, cols = len(grid), len(grid[0])

    count = 0
    for y in range(rows):
        for x in range(cols):
            for dy, dx in DIRS:
                count += 1 if is_xmas(grid, y, x, dy, dx, rows, cols) else 0

    return count


def is_mas(a, b):
    return (a == "M" and b == "S") or a == "S" and b == "M"


def is_x_mas(grid, y, x):
    if grid[y][x] != "A":
        return False

    if not is_mas(grid[y - 1][x - 1], grid[y + 1][x + 1]):
        return False

    if not is_mas(grid[y - 1][x + 1], grid[y + 1][x - 1]):
        return False

    return True


def count_x_mas(grid):
    rows, cols = len(grid), len(grid[0])

    count = 0
    for y in range(1, rows - 1):
        for x in range(1, cols - 1):
            count += 1 if is_x_mas(grid, y, x) else 0

    return count


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_04_example.txt")
puzzle = parse_file("./inputs/day_04_puzzle.txt")

common.time_and_print(count_xmas, example)
common.time_and_print(count_xmas, puzzle)

common.time_and_print(count_x_mas, example)
common.time_and_print(count_x_mas, puzzle)
