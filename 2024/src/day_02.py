import common


def is_safe_delta(delta):
    return delta and abs(delta) <= 3


def is_safe(level, skippable=False):
    prev = None

    for i in range(len(level) - 1, 0, -1):
        curr = level[i - 1] - level[i]
        if (not is_safe_delta(curr)) or (prev is not None and (curr * prev < 0)):
            if skippable:
                skip_next = level[: i - 1] + level[i:]
                skip_current = level[:i] + level[i + 1 :]
                skip_prev = level[: i + 1] + level[i + 2 :]
                return is_safe(skip_next) or is_safe(skip_current) or is_safe(skip_prev)
            else:
                return False
        prev = curr

    return True


def get_num_safe(levels, skippable=False):
    return sum(map(lambda x: is_safe(x, skippable=skippable), levels))


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [list(map(int, line.split())) for line in lines]


example = parse_file("./inputs/day_02_example.txt")
puzzle = parse_file("./inputs/day_02_puzzle.txt")

common.time_and_print(get_num_safe, example)
common.time_and_print(get_num_safe, puzzle)

common.time_and_print(get_num_safe, example, skippable=True)
common.time_and_print(get_num_safe, puzzle, skippable=True)
