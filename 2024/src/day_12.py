import common

DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]


def in_bounds(y, x, rows, cols):
    return y >= 0 and y < rows and x >= 0 and x < cols


def crawl(start_y, start_x, grid, visited):
    rows, cols = len(grid), len(grid[0])
    area = 1
    perimeter = 0
    plant = grid[start_y][start_x]

    stack = [(start_y, start_x)]
    visited.add((start_y, start_x))

    while len(stack):
        curr_y, curr_x = stack.pop()
        for dy, dx in DIRS:
            y, x = curr_y + dy, curr_x + dx
            if not in_bounds(y, x, rows, cols) or grid[y][x] != plant:
                perimeter += 1
                continue
            if (y, x) in visited:
                continue

            area += 1
            stack.append((y, x))
            visited.add((y, x))

    return area * perimeter


def get_sides(perimeter):
    sides = len(perimeter)
    visited = set()

    for edge in perimeter:
        if edge in visited:
            continue
        visited.add(edge)
        stack = [edge]

        while len(stack):
            (curr_y, curr_x), facing = stack.pop()
            dirs = [DIRS[0], DIRS[2]] if facing[1] else [DIRS[1], DIRS[3]]
            for dy, dx in dirs:
                y, x = curr_y + dy, curr_x + dx
                key = ((y, x), facing)
                if key not in visited and key in perimeter:
                    stack.append(key)
                    visited.add(key)
                    sides -= 1

    return sides


def crawl_with_discount(start_y, start_x, grid, visited):
    rows, cols = len(grid), len(grid[0])
    area = 1
    plant = grid[start_y][start_x]

    stack = [(start_y, start_x)]
    visited.add((start_y, start_x))

    perimiter = set()

    while len(stack):
        curr_y, curr_x = stack.pop()
        for dy, dx in DIRS:
            y, x = curr_y + dy, curr_x + dx
            if not in_bounds(y, x, rows, cols) or grid[y][x] != plant:
                perimiter.add(((y, x), (dy, dx)))
                continue
            if (y, x) in visited:
                continue

            area += 1
            stack.append((y, x))
            visited.add((y, x))

    sides = get_sides(perimiter)
    return area * sides


def get_total_price(grid):
    visited = set()

    total = 0
    for y in range(len(grid)):
        for x in range(len(grid[0])):
            if (y, x) not in visited:
                total += crawl(y, x, grid, visited)

    return total


def get_total_discounted_price(grid):
    visited = set()

    total = 0
    for y in range(len(grid)):
        for x in range(len(grid[0])):
            if (y, x) not in visited:
                total += crawl_with_discount(y, x, grid, visited)

    return total


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_12_example.txt")
puzzle = parse_file("./inputs/day_12_puzzle.txt")

common.time_and_print(get_total_price, example)
common.time_and_print(get_total_price, puzzle)

common.time_and_print(get_total_discounted_price, example)
common.time_and_print(get_total_discounted_price, puzzle)
