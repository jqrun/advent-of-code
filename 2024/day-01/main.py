import time
import pickle


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
    lines = open(path, "r").read().split("\n")
    return [[int(x) for x in line.split()] for line in lines]


def time_and_print(func, *args):
    start = time.time()
    print(func(*args))
    end = time.time()
    print(f"({end - start} seconds)\n")


example = parse_file("day-01/example.txt")
puzzle = parse_file("day-01/puzzle.txt")

time_and_print(get_total_distance, example)
time_and_print(get_total_distance, puzzle)

time_and_print(get_similarity, example)
time_and_print(get_similarity, puzzle)
