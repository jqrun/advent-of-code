import common

ARROWS = {"^": -1, ">": 1j, "v": 1, "<": -1j}

NUMPAD = {
    0 + 0j: "7",
    0 + 1j: "8",
    0 + 2j: "9",
    1 + 0j: "4",
    1 + 1j: "5",
    1 + 2j: "6",
    2 + 0j: "1",
    2 + 1j: "2",
    2 + 2j: "3",
    3 + 1j: "0",
    3 + 2j: "A",
}
NUMPAD_REV = dict([(v, k) for k, v in NUMPAD.items()])

DIRPAD = {0 + 1j: "^", 0 + 2j: "A", 1 + 0j: "<", 1 + 1j: "v", 1 + 2j: ">"}
DIRPAD_REV = dict([(v, k) for k, v in DIRPAD.items()])


@common.memoize
def get_min_moves(start: complex, target: complex, depth: int, numeric=False) -> int:
    pad = NUMPAD if numeric else DIRPAD

    paths = []
    crawl = [(start, "")]
    for pos, moves in crawl:
        if pos == target:
            if depth == 0:
                return len(moves) + 1
            paths.append(moves + "A")
            continue

        branches = []
        branches += ["^"] if pos.real > target.real else []
        branches += ["v"] if pos.real < target.real else []
        branches += ["<"] if pos.imag > target.imag else []
        branches += [">"] if pos.imag < target.imag else []
        for branch in branches:
            next = (pos + ARROWS[branch], moves + branch)
            if next[0] in pad:
                crawl.append(next)

    lowest = float("inf")
    for path in map(lambda x: "A" + x, paths):
        total = 0
        for i in range(len(path) - 1):
            s, t = DIRPAD_REV[path[i]], DIRPAD_REV[path[i + 1]]
            total += get_min_moves(s, t, depth - 1)
        lowest = min(lowest, total)

    return lowest


def sum_complexities(codes: list[str], depth: int) -> int:
    total = 0
    for code in codes:
        moves = 0
        for i in range(len(code)):
            s = NUMPAD_REV[code[i - 1]] if i > 0 else NUMPAD_REV["A"]
            t = NUMPAD_REV[code[i]]
            moves += get_min_moves(s, t, depth, numeric=True)
        code_num = int(code.replace("A", ""))
        total += moves * code_num

    return total


def parse_file(path) -> list[str]:
    return common.open_relative_path(path).split("\n")


example = parse_file("./inputs/day_21_example.txt")
puzzle = parse_file("./inputs/day_21_puzzle.txt")

common.time_and_print(sum_complexities, example, 2)
common.time_and_print(sum_complexities, puzzle, 2)

common.time_and_print(sum_complexities, example, 25)
common.time_and_print(sum_complexities, puzzle, 25)
