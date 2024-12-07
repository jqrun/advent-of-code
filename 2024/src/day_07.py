import common
import re


@common.memoize
def is_possibly_valid(equation, use_concat):
    target, nums = equation[0], list(equation[1:])
    if len(nums) == 1:
        return target == nums[0]

    mul_target = target / nums[-1]
    if mul_target % 1 == 0 and is_possibly_valid(
        tuple([int(mul_target)] + nums[:-1]), use_concat
    ):
        return True

    add_target = target - nums[-1]
    if is_possibly_valid(tuple([add_target] + nums[:-1]), use_concat):
        return True

    if use_concat and str(target).endswith(str(nums[-1])):
        concat_target = target // 10 ** len(str(nums[-1]))
        if is_possibly_valid(tuple([concat_target] + nums[:-1]), use_concat):
            return True

    return False


def sum_valid_equations(equations, use_concat=False):
    total = 0
    for equation in equations:
        total += equation[0] if is_possibly_valid(equation, use_concat) else 0
    return total


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [tuple(map(int, re.split(r"\D+", line))) for line in lines]


example = parse_file("./inputs/day_07_example.txt")
puzzle = parse_file("./inputs/day_07_puzzle.txt")

common.time_and_print(sum_valid_equations, example)
common.time_and_print(sum_valid_equations, puzzle)

common.time_and_print(sum_valid_equations, example, use_concat=True)
common.time_and_print(sum_valid_equations, puzzle, use_concat=True)
