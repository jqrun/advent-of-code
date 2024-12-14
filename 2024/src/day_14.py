import common
import re


def simulate(
    robots: list[tuple[int, int, int, int]], seconds=100, width=101, height=103
) -> int:
    positions = []

    for x, y, dx, dy in robots:
        positions.append(((x + dx * seconds) % width, (y + dy * seconds) % height))

    mid_x, mid_y = width // 2, height // 2
    quadrants = [0, 0, 0, 0]
    for x, y in positions:
        if x < mid_x and y < mid_y:
            quadrants[0] += 1
        elif x > mid_x and y < mid_y:
            quadrants[1] += 1
        elif x < mid_x and y > mid_y:
            quadrants[2] += 1
        elif x > mid_x and y > mid_y:
            quadrants[3] += 1

    safety_factor = 1
    for count in quadrants:
        safety_factor *= count
    return safety_factor


def print_positions(positions, width=101, height=103) -> None:
    text = ""
    for i in range(width):
        for j in range(height):
            text += "X" if (i, j) in positions else "."
        text += "\n"
    print(text)


def draw(
    robots: list[tuple[int, int, int, int]], times=[100], width=101, height=103
) -> None:

    for time in times:
        positions = set()
        for x, y, dx, dy in robots:
            positions.add(((x + dx * time) % width, (y + dy * time) % height))
        print_positions(positions)
        print(f"Time: {time}\n\n")

    return


def draw_lowest_safety_factors(
    robots: list[tuple[int, int, int, int]], width=101, height=103
) -> None:
    factors = []
    for i in range(width * height):
        factors.append((i, simulate(robots, seconds=i)))
    factors.sort(key=lambda x: x[1])
    draw(robots, times=list(map(lambda x: x[0], factors))[:1])


def parse_file(path) -> list[tuple[int, int, int, int]]:
    lines = common.open_relative_path(path).split("\n")
    return [tuple(map(int, re.findall(r"-?\d+", line))) for line in lines]


example = parse_file("./inputs/day_14_example.txt")
puzzle = parse_file("./inputs/day_14_puzzle.txt")

common.time_and_print(simulate, example, width=11, height=7)
common.time_and_print(simulate, puzzle)

common.time_and_print(draw_lowest_safety_factors, puzzle)
