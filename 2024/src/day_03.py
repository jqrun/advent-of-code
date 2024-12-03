import common
import re


def sum_muls(lines):
    total = 0
    for line in lines:
        groups = re.findall(r"mul\((\d{1,3}),(\d{1,3})\)", line)
        total += sum(map(lambda x: int(x[0]) * int(x[1]), groups))
    return total


def multiply(text):
    nums = list(map(int, re.sub(r"[mul\(\)]", "", text).split(",")))
    return nums[0] * nums[1]


def sum_cond_muls(lines):
    total = 0
    stopped = False
    for line in lines:
        groups = re.findall(r"mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)", line)
        for group in groups:
            if group == "do()":
                stopped = False
            elif group == "don't()":
                stopped = True
            elif not stopped:
                total += multiply(group)
    return total


def parse_file(path):
    return common.open_relative_path(path).split("\n")


example = parse_file("./inputs/day_03_example.txt")
example2 = parse_file("./inputs/day_03_example2.txt")
puzzle = parse_file("./inputs/day_03_puzzle.txt")

common.time_and_print(sum_muls, example)
common.time_and_print(sum_muls, puzzle)

common.time_and_print(sum_cond_muls, example2)
common.time_and_print(sum_cond_muls, puzzle)
