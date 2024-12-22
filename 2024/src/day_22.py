import common
import typing


def pairwise(list: list[int]) -> typing.Generator[tuple[int, int], None, None]:
    for i in range(len(list) - 1):
        yield (list[i], list[i + 1])


def evolve(num: int) -> int:
    num = (num ^ (num * 64)) % 16777216
    num = (num ^ (num // 32)) % 16777216
    return (num ^ (num * 2048)) % 16777216


def gen_secret_numbers(initials: list[int]) -> int:
    total = 0
    for num in initials:
        for _ in range(2000):
            num = evolve(num)
        total += num
    return total


def get_most_bananas(initials: list[int]) -> int:
    nums = map(lambda x: gen_secret_numbers(x, 2000), initials)
    seqs = {}
    for n in initials:
        nums = [n] + [n := evolve(n) for _ in range(2000)]
        diffs = [b % 10 - a % 10 for (a, b) in pairwise(nums)]
        seen = set()
        for i in range(len(nums) - 4):
            seq = tuple(diffs[i : i + 4])
            if seq not in seen:
                seqs[seq] = seqs.get(seq, 0) + (nums[i + 4] % 10)
                seen.add(seq)

    return max(seqs.values())


def parse_file(path) -> list[int]:
    return list(map(int, common.open_relative_path(path).split("\n")))


example = parse_file("./inputs/day_22_example.txt")
puzzle = parse_file("./inputs/day_22_puzzle.txt")

common.time_and_print(gen_secret_numbers, example)
common.time_and_print(gen_secret_numbers, puzzle)

common.time_and_print(get_most_bananas, example)
common.time_and_print(get_most_bananas, puzzle)
