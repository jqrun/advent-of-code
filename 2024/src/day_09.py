import common


def get_block_checksum(start, length, id):
    end = start + length - 1
    sum_to_start = ((start - 1) * start) / 2
    sum_to_end = (end * (end + 1)) / 2
    return (sum_to_end - sum_to_start) * id


def compact_eagerly(disk_map):
    map = disk_map.copy()
    left, right = 0, len(map) - 1
    position = 0
    checksum = 0

    while left < len(map):
        if left % 2 == 0:
            length = map[left]
            checksum += get_block_checksum(position, length, left // 2)
            position += length
        else:
            space = map[left]
            while space and left < right:
                moved = map[right] if space >= map[right] else space
                space -= moved
                map[right] -= moved
                checksum += get_block_checksum(position, moved, right // 2)
                position += moved
                right -= 0 if map[right] else 2

        left += 1

    return int(checksum)


def compact_full_files(disk_map):
    map = disk_map.copy()
    right = len(map) - 1

    while right >= 0:
        to_move = map[right]

        for idx, val in enumerate(map):
            if idx > right:
                continue
            if idx % 2 == 1 and (type(val) is not list or val[0]):
                move_ref = (right // 2, to_move)
                moved = False
                if type(val) is not list and val >= to_move:
                    map[idx] = [val - to_move, move_ref]
                    moved = True
                elif type(val) is list and val[0] >= to_move:
                    val.append(move_ref)
                    val[0] -= to_move
                    moved = True
                if moved:
                    map[right] = -to_move
                    break

        right -= 2

    checksum = 0
    position = 0
    for idx, val in enumerate(map):
        if idx % 2 == 0:
            length = map[idx]
            if length < 0:
                position -= length
            else:
                checksum += get_block_checksum(position, length, idx // 2)
                position += length
        elif type(val) is list:
            for id, length in val[1:]:
                checksum += get_block_checksum(position, length, id)
                position += length
            position += val[0]
        else:
            position += val

    return int(checksum)


def parse_file(path):
    line = common.open_relative_path(path)
    return [int(char) for char in line]


example = parse_file("./inputs/day_09_example.txt")
puzzle = parse_file("./inputs/day_09_puzzle.txt")

common.time_and_print(compact_eagerly, example)
common.time_and_print(compact_eagerly, puzzle)

common.time_and_print(compact_full_files, example)
common.time_and_print(compact_full_files, puzzle)
