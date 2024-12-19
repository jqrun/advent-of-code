import common


def can_design(patterns: frozenset[str], design: str) -> bool:
    if design in patterns:
        return True

    if len(design) == 1:
        return False

    for pattern in patterns:
        if design.endswith(pattern) and can_design(patterns, design[: -len(pattern)]):
            return True

    return False


@common.memoize
def get_arrangements(patterns: frozenset[str], design: str) -> int:
    if not len(design):
        return 1

    if len(design) == 1 and design not in patterns:
        return 0

    count = 0
    for pattern in patterns:
        if design.endswith(pattern):
            if sub_count := get_arrangements(patterns, design[: -len(pattern)]):
                count += sub_count

    return count


def count_possible_designs(patterns: frozenset[str], designs: list[str]) -> int:
    return sum([1 if can_design(patterns, x) else 0 for x in designs])


def count_all_arrangements(patterns: frozenset[str], designs: list[str]) -> int:
    return sum([get_arrangements(patterns, x) for x in designs])


def parse_file(path) -> tuple[frozenset[str], list[str]]:
    patterns, designs = common.open_relative_path(path).split("\n\n")
    patterns = frozenset(patterns.split(", "))
    designs = designs.split("\n")
    return (patterns, designs)


example = parse_file("./inputs/day_19_example.txt")
puzzle = parse_file("./inputs/day_19_puzzle.txt")

common.time_and_print(count_possible_designs, *example)
common.time_and_print(count_possible_designs, *puzzle)

common.time_and_print(count_all_arrangements, *example)
common.time_and_print(count_all_arrangements, *puzzle)
