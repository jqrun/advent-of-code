import common
from typing import Optional

DIRS = {"^": (-1, 0), ">": (0, 1), "v": (1, 0), "<": (0, -1)}


def swap(grid: list[list[str]], y1: int, x1: int, y2: int, x2: int) -> None:
    grid[y1][x1], grid[y2][x2] = grid[y2][x2], grid[y1][x1]


def get_position(grid: list[list[str]], char: str) -> tuple[int, int]:
    for y in range(len(grid)):
        for x, cell in enumerate(grid[y]):
            if cell == char:
                return (y, x)
    return (-1, -1)


def find_space(
    grid: list[list[str]], start: tuple[int, int], dir: tuple[int, int]
) -> Optional[tuple[int, int]]:
    y, x = start
    dy, dx = dir

    while grid[y][x] != ".":
        y, x = y + dy, x + dx
        if grid[y][x] == "#":
            return None

    return (y, x)


def sum_coords(grid: list[list[str]]) -> int:
    total = 0
    for y in range(len(grid)):
        for x, cell in enumerate(grid[y]):
            if cell == "O" or cell == "[":
                total += 100 * y + x

    return total


def expand_grid(grid: list[list[str]]) -> list[list[str]]:
    new_grid = []
    for row in grid:
        new_row = []
        for cell in row:
            if cell == "@":
                new_row += ["@", "."]
            elif cell == "O":
                new_row += ["[", "]"]
            else:
                new_row += [cell, cell]
        new_grid.append(new_row)

    return new_grid


def get_moved_coords_sum(grid: list[list[str]], moves: list[str]) -> int:
    grid = [x[:] for x in grid]

    y, x = get_position(grid, "@")
    for move in moves:
        dy, dx = DIRS[move]
        next_y, next_x = y + dy, x + dx
        space = find_space(grid, (y, x), (dy, dx))
        if space is None:
            continue

        if grid[next_y][next_x] == "O":
            swap(grid, next_y, next_x, *space)

        swap(grid, y, x, next_y, next_x)
        y, x = next_y, next_x

    return sum_coords(grid)


def try_shift_horizontal(grid: list[list[str]], y, x, dx) -> bool:
    val = grid[y][x]

    if val == "#":
        can_shift = False
    elif val == ".":
        can_shift = True
    else:
        can_shift = try_shift_horizontal(grid, y, x + dx, dx)

    if can_shift and val != "@":
        swap(grid, y, x, y, x - dx)
    return can_shift


def shift_vertical(grid: list[list[str]], y: int, x: int, dy: int):
    val = grid[y][x]

    if val == "@":
        shift_vertical(grid, y + dy, x, dy)
    elif val == ".":
        pass
    elif val:
        dx = 1 if val == "[" else -1
        shift_vertical(grid, y + dy, x, dy)
        shift_vertical(grid, y + dy, x + dx, dy)

    if val != "@":
        swap(grid, y, x, y - dy, x)


def can_shift_vertical(grid: list[list[str]], y: int, x: int, dy: int) -> bool:
    val = grid[y][x]

    if val == "@":
        return can_shift_vertical(grid, y + dy, x, dy)
    elif val == ".":
        return True
    elif val == "#":
        return False
    elif val:
        dx = 1 if val == "[" else -1
        return can_shift_vertical(grid, y + dy, x, dy) and can_shift_vertical(
            grid, y + dy, x + dx, dy
        )


def try_shift_vertical(grid: list[list[str]], y: int, x: int, dy: int) -> bool:
    if can_shift_vertical(grid, y, x, dy):
        shift_vertical(grid, y, x, dy)
        return True
    return False


def get_expanded_moved_coords_sum(grid: list[list[str]], moves: list[str]) -> int:
    grid = expand_grid(grid)

    y, x = get_position(grid, "@")
    for move in moves:
        dy, dx = DIRS[move]
        next_y, next_x = y + dy, x + dx
        next_cell = grid[next_y][next_x]

        if next_cell == "#":
            continue
        elif next_cell == ".":
            swap(grid, y, x, next_y, next_x)
        elif dx:
            if not try_shift_horizontal(grid, y, x, dx):
                continue
        else:
            if not try_shift_vertical(grid, y, x, dy):
                continue

        y, x = next_y, next_x

    return sum_coords(grid)


def parse_file(path: str) -> tuple[list[list[str]], list[str]]:
    grid, moves = common.open_relative_path(path).split("\n\n")
    grid = [[char for char in line] for line in grid.split("\n")]
    moves = [char for char in moves if char != "\n"]

    return (grid, moves)


example = parse_file("./inputs/day_15_example.txt")
puzzle = parse_file("./inputs/day_15_puzzle.txt")

common.time_and_print(get_moved_coords_sum, *example)
common.time_and_print(get_moved_coords_sum, *puzzle)

common.time_and_print(get_expanded_moved_coords_sum, *example)
common.time_and_print(get_expanded_moved_coords_sum, *puzzle)
