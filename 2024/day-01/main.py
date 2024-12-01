import pickle


def parse_file(path):
    lines = open(path, "r").read().split("\n")
    return [[int(x) for x in line.split()] for line in lines]


example = parse_file("day-01/example.txt")
print(example)
