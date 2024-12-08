import common


def some_func(x):
    return x


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [list(map(int, line.split())) for line in lines]


example = parse_file("./inputs/day_08_example.txt")
puzzle = parse_file("./inputs/day_08_puzzle.txt")

common.time_and_print(some_func, example)
# common.time_and_print(some_func, puzzle)
