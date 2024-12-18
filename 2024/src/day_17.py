import common
import re


def eval_combo_operand(registers: list[int], operand: int) -> int:
    if operand <= 3:
        return operand
    if operand <= 6:
        return registers[operand - 4]
    return -1


def eval_operation(
    registers: list[int], opcode: int, operand: int, output: list[int]
) -> int:
    if opcode == 0:
        registers[0] = registers[0] // 2 ** eval_combo_operand(registers, operand)
    elif opcode == 1:
        registers[1] ^= operand
    elif opcode == 2:
        registers[1] = eval_combo_operand(registers, operand) % 8
    elif opcode == 3:
        if registers[0] == 0:
            pass
        else:
            return operand
    elif opcode == 4:
        registers[1] ^= registers[2]
    elif opcode == 5:
        output.append(eval_combo_operand(registers, operand) % 8)
    elif opcode == 6:
        registers[1] = registers[0] // 2 ** eval_combo_operand(registers, operand)
    elif opcode == 7:
        registers[2] = registers[0] // 2 ** eval_combo_operand(registers, operand)

    return -1


def get_program_output(registers: list[int], program: list[int]) -> str:
    registers = registers.copy()
    output: list[int] = []
    pointer = 0
    while pointer < len(program) - 1:
        eval_jump = eval_operation(
            registers, program[pointer], program[pointer + 1], output
        )
        pointer = eval_jump if eval_jump >= 0 else pointer + 2
    return ",".join(map(str, output))


def find_lowest_a(program: list[int], a=0, depth=0) -> int:
    target = program[::-1]
    if depth == len(target):
        return a

    for i in range(8):
        partial_a = (a << 3) + i
        output = get_program_output([partial_a, 0, 0], program)
        if output[0] == str(target[depth]):
            if result := find_lowest_a(program, partial_a, depth + 1):
                return result

    return 0


def parse_file(path) -> tuple[list[int], list[int]]:
    registers, program = common.open_relative_path(path).split("\n\n")
    registers = [int(x) for x in re.findall(r"\s(\d+)", registers)]
    program = [int(x) for x in program.replace("Program: ", "").split(",")]
    return (registers, program)


example = parse_file("./inputs/day_17_example.txt")
puzzle = parse_file("./inputs/day_17_puzzle.txt")

common.time_and_print(get_program_output, *example)
common.time_and_print(get_program_output, *puzzle)

common.time_and_print(find_lowest_a, puzzle[1])
