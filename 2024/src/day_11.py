import common


@common.memoize
def resolve_blinks(stones, blinks):
    if not blinks:
        return len(stones)

    if len(stones) == 1:
        stone = stones[0]
        if stone == 0:
            return resolve_blinks(tuple([1]), blinks - 1)
        elif stone > 9 and len(str(stone)) % 2 == 0:
            half_len = len(str(stone)) // 2
            left = stone // (10**half_len)
            right = stone - (left * (10**half_len))
            return sum(
                map(lambda x: resolve_blinks(tuple([x]), blinks - 1), [left, right])
            )
        else:
            return resolve_blinks(tuple([stone * 2024]), blinks - 1)

    resolution = 0
    for stone in stones:
        resolution += resolve_blinks(tuple([stone]), blinks)
    return resolution


def parse_file(path):
    return tuple(int(x) for x in common.open_relative_path(path).split(" "))


example = parse_file("./inputs/day_11_example.txt")
puzzle = parse_file("./inputs/day_11_puzzle.txt")

common.time_and_print(resolve_blinks, example, 25)
common.time_and_print(resolve_blinks, puzzle, 25)

common.time_and_print(resolve_blinks, example, 75)
common.time_and_print(resolve_blinks, puzzle, 75)
