import common


def get_frequency_map(grid):
    map = {}
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == ".":
                continue
            if cell not in map:
                map[cell] = []
            map[cell].append((y, x))

    return map


def in_bounds(y, x, rows, cols):
    return y >= 0 and y < rows and x >= 0 and x < cols


def get_antinodes(a, b):
    ay, ax = a
    by, bx = b
    dy, dx = by - ay, bx - ax
    return [(ay - dy, ax - dx), (by + ay, bx + dx)]


def get_num_antinodes(grid):
    rows, cols = len(grid), len(grid[0])
    freq_map = get_frequency_map(grid)

    locations = set()
    for nodes in freq_map.values():
        for i, a in enumerate(nodes):
            for j in range(i + 1, len(nodes)):
                b = nodes[j]
                antinodes = list(
                    filter(
                        lambda x: in_bounds(x[0], x[1], rows, cols), get_antinodes(a, b)
                    )
                )
                print(a, b, antinodes)
                for x in antinodes:
                    locations.add(x)

    return len(locations)


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[char for char in line] for line in lines]


example = parse_file("./inputs/day_08_example.txt")
example2 = parse_file("./inputs/day_08_example2.txt")
puzzle = parse_file("./inputs/day_08_puzzle.txt")

common.time_and_print(get_num_antinodes, example)
common.time_and_print(get_num_antinodes, example2)
# common.time_and_print(get_num_antinodes, puzzle)
