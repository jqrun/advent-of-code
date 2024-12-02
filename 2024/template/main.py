import time
import pickle


def some_func(x):
    return x


def parse_file(path):
    lines = open(path, "r").read().split("\n")
    return [line for line in lines]


def time_and_print(func, *args, **kwargs):
    start = time.time()
    print(func(*args, **kwargs))
    end = time.time()
    print(f"({end - start} seconds)\n")


example = parse_file("template/example.txt")
puzzle = parse_file("template/puzzle.txt")

time_and_print(some_func, example)
time_and_print(some_func, puzzle)
