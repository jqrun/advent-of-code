import common

DIRS = [(-1, 0), [0, 1], [1, 0], [0, -1]]


def get_min_steps_to_exit(
    bytes: list[tuple[int, int]], num_fallen=1024, max_coord=70
) -> int:
    byte_set = set(bytes[:num_fallen])

    stack = [(0, 0)]
    visited: set[tuple[int, int]] = set()

    steps = 0
    while len(stack):
        next_step: list[tuple[int, int]] = []

        while len(stack):
            curr = stack.pop()

            if curr == (max_coord, max_coord):
                return steps

            if curr in visited:
                continue
            visited.add(curr)

            for dy, dx in DIRS:
                y, x = curr[0] + dy, curr[1] + dx
                if y < 0 or x < 0 or y > max_coord or x > max_coord:
                    continue
                if (x, y) in byte_set:
                    continue
                next_step.append((y, x))

        steps += 1
        stack = next_step

    return 0


def get_first_blocking_byte(bytes: list[tuple[int, int]], max_coord=70) -> str:
    left = 1
    right = len(bytes) - 1

    while left <= right:
        mid = (left + right) // 2
        steps_at = get_min_steps_to_exit(bytes, num_fallen=mid, max_coord=max_coord)
        steps_before = get_min_steps_to_exit(
            bytes, num_fallen=mid - 1, max_coord=max_coord
        )

        if not steps_at and steps_before:
            return f"{bytes[mid - 1][0]},{bytes[mid - 1][1]}"
        elif not steps_at and not steps_before:
            right = mid - 1
        else:
            left = mid + 1

    return ""


def parse_file(path) -> list[tuple[int, int]]:
    lines = common.open_relative_path(path).split("\n")
    return [tuple(map(int, line.split(","))) for line in lines]


example = parse_file("./inputs/day_18_example.txt")
puzzle = parse_file("./inputs/day_18_puzzle.txt")

common.time_and_print(get_min_steps_to_exit, example, num_fallen=12, max_coord=6)
common.time_and_print(get_min_steps_to_exit, puzzle)

common.time_and_print(get_first_blocking_byte, example, max_coord=6)
common.time_and_print(get_first_blocking_byte, puzzle)
