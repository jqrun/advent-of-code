import common


def get_counts(list):
    counts = {}
    for x in list:
        counts[x] = counts.get(x, 0) + 1
    return counts


def get_similarity(locations):
    left, right = zip(*locations)
    right_counts = get_counts(right)
    score = 0
    for x in left:
        score += x * right_counts.get(x, 0)
    return score


def get_total_distance(locations):
    left, right = zip(*locations)
    left = sorted(list(left))
    right = sorted(list(right))
    total = 0
    for x, y in zip(left, right):
        total += abs(x - y)
    return total


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[int(x) for x in line.split()] for line in lines]


example = parse_file("./inputs/day_01_example.txt")
puzzle = parse_file("./inputs/day_01_puzzle.txt")

common.time_and_print(get_total_distance, example)
common.time_and_print(get_total_distance, puzzle)

common.time_and_print(get_similarity, example)
common.time_and_print(get_similarity, puzzle)
