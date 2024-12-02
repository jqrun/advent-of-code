import time
import pickle


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
    lines = open(path, "r").read().split("\n")
    return [list(map(int, line.split())) for line in lines]


def time_and_print(func, *args, **kwargs):
    start = time.time()
    print(func(*args, **kwargs))
    end = time.time()
    print(f"({end - start} seconds)\n")


example = parse_file("day-02/example.txt")
puzzle = parse_file("day-02/puzzle.txt")

time_and_print(get_num_safe, example)
time_and_print(get_num_safe, puzzle)

time_and_print(get_num_safe, example, skippable=True)
time_and_print(get_num_safe, puzzle, skippable=True)
