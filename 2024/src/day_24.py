import common
import re


def exec_op(op: str, a: int, b: int) -> int:
    return int(a or b) if op == "OR" else int(a and b) if op == "AND" else a ^ b


def eval(out: str, wires: dict[str, int], gates: dict[str, list[str]]) -> int:
    if out in wires:
        return wires[out]

    a, op, b = gates[out]
    a = eval(a, wires, gates)
    b = eval(b, wires, gates)
    return exec_op(op, a, b)


def get_wires_val(wires: list[tuple[str, int]]) -> int:
    bin = sorted(wires, key=lambda x: x[0], reverse=True)
    bin = "".join(map(lambda x: str(x[1]), bin))
    return int(bin, 2)


def get_output(wires: dict[str, int], gates: dict[str, list[str]]) -> int:
    wires, gates = wires.copy(), gates.copy()
    outs = {}

    for w in gates.keys():
        if w.startswith("z"):
            outs[w] = eval(w, wires, gates)

    return get_wires_val(outs.items())


def get_expected(wires: dict[str, int]) -> int:
    x = get_wires_val(list(filter(lambda x: x[0][0] == "x", wires.items())))
    y = get_wires_val(list(filter(lambda x: x[0][0] == "y", wires.items())))
    return x + y


def inspect(
    out: str, wires: dict[str, int], gates: dict[str, list[str]], depth: int
) -> str:
    if out in wires or depth >= 3:
        return out

    a, op, b = gates[out]
    a = inspect(a, wires, gates, depth + 1)
    b = inspect(b, wires, gates, depth + 1)
    return f"{out}({a} {op} {b})"


def investigate(wires: dict[str, int], gates: dict[str, list[str]]) -> str:
    print("Investigating...")
    expected = get_expected(wires)
    actual = get_output(wires, gates)
    diff = bin(expected ^ actual)
    print(diff)

    # Inspecting starting with first wrong bit, 20
    print(inspect("z18", wires, gates, 0))
    print(inspect("z19", wires, gates, 0))
    print(inspect("z20", wires, gates, 0))
    print(inspect("z21", wires, gates, 0))
    print()
    # swap(vvf, z19)

    # Inspecting 24
    print(inspect("z22", wires, gates, 0))
    print(inspect("z23", wires, gates, 0))
    print(inspect("z24", wires, gates, 0))
    print(inspect("z25", wires, gates, 0))
    print()
    # swap(fgn, dck)

    # Inspecting 38
    print(inspect("z36", wires, gates, 0))
    print(inspect("z37", wires, gates, 0))
    print(inspect("z38", wires, gates, 0))
    print(inspect("z39", wires, gates, 0))
    print(inspect("z40", wires, gates, 0))
    print()
    # swap(nvh, z37)

    # Inspecting 13 after using new input numbers
    print(inspect("z11", wires, gates, 0))
    print(inspect("z12", wires, gates, 0))
    print(inspect("z13", wires, gates, 0))
    print(inspect("z14", wires, gates, 0))

    print(",".join(sorted(["vvf", "z19", "fgn", "dck", "nvh", "z37", "qdg", "z12"])))

    return "Done."


def parse_file(path) -> tuple[dict[str, int], dict[str, list[str]]]:
    wires, gates = common.open_relative_path(path).split("\n\n")
    wires = dict([(x, int(y)) for x, y in [z.split(": ") for z in wires.split("\n")]])
    gates = [re.split(r"\s(?:->\s)?", x) for x in gates.split("\n")]
    gates = dict([(x[3], x[:3]) for x in gates])
    return (wires, gates)


example = parse_file("./inputs/day_24_example.txt")
puzzle = parse_file("./inputs/day_24_puzzle.txt")

common.time_and_print(get_output, *example)
common.time_and_print(get_output, *puzzle)

common.time_and_print(investigate, *puzzle)
