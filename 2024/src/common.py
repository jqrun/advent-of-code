from pathlib import Path
import pickle
import time


def time_and_print(func, *args, **kwargs):
    start = time.time()
    print(func(*args, **kwargs))
    end = time.time()
    print(f"({end - start} seconds)\n")


def open_relative_path(relative_path):
    path = Path(__file__).parent / relative_path
    return open(path, "r").read()
