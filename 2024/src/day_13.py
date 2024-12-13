import common
import re


def get_token_cost(machine):
    a, b, prize = machine

    eq_1 = [x * b[1] for x in [a[0], prize[0]]]
    eq_2 = [x * b[0] for x in [a[1], prize[1]]]

    a_val = (eq_1[1] - eq_2[1]) / (eq_1[0] - eq_2[0])
    if not a_val.is_integer():
        return None

    b_val = (prize[0] - (a[0] * a_val)) / b[0]

    return (a_val * 3, b_val)


def get_cost_of_wins(machines, extra_prize=0):
    total = 0
    for machine in machines:
        prizes = (machine[2][0] + extra_prize, machine[2][1] + extra_prize)
        machine = (machine[0], machine[1], prizes)
        cost = get_token_cost(machine)
        total += sum(cost) if cost is not None else 0
    return int(total)


def parse_file(path):
    groups = common.open_relative_path(path).split("\n\n")
    machines = [
        tuple([tuple(map(int, re.findall(r"\d+", line))) for line in group.split("\n")])
        for group in groups
    ]
    return machines


example = parse_file("./inputs/day_13_example.txt")
puzzle = parse_file("./inputs/day_13_puzzle.txt")

common.time_and_print(get_cost_of_wins, example)
common.time_and_print(get_cost_of_wins, puzzle)

common.time_and_print(get_cost_of_wins, example, extra_prize=10_000_000_000_000)
common.time_and_print(get_cost_of_wins, puzzle, extra_prize=10_000_000_000_000)
