import common
from collections import deque

DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]


def in_bounds(y, x, rows, cols):
    return y >= 0 and y < rows and x >= 0 and x < cols


def crawl_peak(peak_y, peak_x, grid, reachable):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    queue = deque([(peak_y, peak_x)])

    while len(queue):
        curr_y, curr_x = queue.popleft()
        curr_height = grid[curr_y][curr_x]
        for dy, dx in DIRS:
            y, x = curr_y + dy, curr_x + dx
            if (y, x) not in visited and in_bounds(y, x, rows, cols):
                if curr_height == grid[y][x] + 1:
                    if (y, x) not in reachable:
                        reachable[(y, x)] = set()
                    reachable[(y, x)].add((peak_y, peak_x))
                    visited.add((y, x))
                    queue.append((y, x))

    return


def crawl_trailhead(head_y, head_x, grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(head_y, head_x)])
    trails = {(head_y, head_x): 1}
    peaks = set()

    while len(queue):
        curr_y, curr_x = queue.popleft()
        curr_height = grid[curr_y][curr_x]

        for dy, dx in DIRS:
            y, x = curr_y + dy, curr_x + dx
            if in_bounds(y, x, rows, cols):
                if curr_height == grid[y][x] - 1:
                    trails[(y, x)] = trails.get((y, x), 0) + trails[curr_y, curr_x]

                    if grid[y][x] == 9:
                        peaks.add((y, x))
                    if (y, x) not in queue:
                        queue.append((y, x))

    rating = 0
    for peak in peaks:
        rating += trails[peak]

    return rating


def get_simple_scores(grid):
    reachable = {}
    trailheads = []

    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == 0:
                trailheads.append((y, x))
            if cell == 9:
                crawl_peak(y, x, grid, reachable)

    scores = 0
    for y, x in trailheads:
        scores += len(reachable.get((y, x), set()))
    return scores


def get_ratings(grid):
    ratings = 0
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == 0:
                ratings += crawl_trailhead(y, x, grid)

    return ratings


def parse_file(path):
    lines = common.open_relative_path(path).split("\n")
    return [[int(x) for x in line] for line in lines]


example = parse_file("./inputs/day_10_example.txt")
puzzle = parse_file("./inputs/day_10_puzzle.txt")

common.time_and_print(get_simple_scores, example)
common.time_and_print(get_simple_scores, puzzle)

common.time_and_print(get_ratings, example)
common.time_and_print(get_ratings, puzzle)
