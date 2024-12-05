import common


def get_dependency_map(ordering):
    dependencies = {}
    for before, after in ordering:
        if after not in dependencies:
            dependencies[after] = set()
        dependencies[after].add(before)
    return dependencies


def is_ordered(update, dependencies):
    remaining = set(update)
    for page in update:
        remaining.remove(page)
        if page not in dependencies:
            continue
        if any(later_page in dependencies[page] for later_page in remaining):
            return False
    return True


def get_mid(update):
    return update[len(update) // 2]


def sum_correct_ordered(instructions):
    ordering, updates = instructions
    dependencies = get_dependency_map(ordering)

    total = 0
    for update in updates:
        total += get_mid(update) if is_ordered(update, dependencies) else 0
    return total


def get_fixed_order(update, dependencies):
    local_deps = {}
    for page in update:
        local_deps[page] = set(
            filter(lambda x: x in update, dependencies.get(page, set()))
        )

    new_order = []
    while local_deps:
        to_add = next(page for page, deps in local_deps.items() if not len(deps))
        del local_deps[to_add]
        new_order.append(to_add)
        for page in local_deps.keys():
            local_deps[page].discard(to_add)

    return new_order


def sum_order_fixes(instructions):
    ordering, updates = instructions
    dependencies = get_dependency_map(ordering)
    to_fix = filter(lambda x: not is_ordered(x, dependencies), updates)

    total = 0
    for update in to_fix:
        total += get_mid(get_fixed_order(update, dependencies))
    return total


def parse_file(path):
    ordering, updates = common.open_relative_path(path).split("\n\n")
    ordering = [list(map(int, line.split("|"))) for line in ordering.split("\n")]
    updates = [list(map(int, line.split(","))) for line in updates.split("\n")]
    return [ordering, updates]


example = parse_file("./inputs/day_05_example.txt")
puzzle = parse_file("./inputs/day_05_puzzle.txt")

common.time_and_print(sum_correct_ordered, example)
common.time_and_print(sum_correct_ordered, puzzle)

common.time_and_print(sum_order_fixes, example)
common.time_and_print(sum_order_fixes, puzzle)
