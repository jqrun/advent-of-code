use std::fs;

type Range = (u32, u32);
type Pair = (Range, Range);
type Pairs = Vec<Pair>;

fn main() {
    let example = parse_input("src/day-04/example.txt");
    let puzzle = parse_input("src/day-04/puzzle.txt");

    println!("{}", get_num_contained_pairs(&example));
    println!("{}", get_num_contained_pairs(&puzzle));

    println!("{}", get_num_overlapping_pairs(&example));
    println!("{}", get_num_overlapping_pairs(&puzzle));
}

fn get_num_overlapping_pairs(pairs: &Pairs) -> u32 {
    let mut count = 0;
    for pair in pairs {
        if has_overlapping_range(&pair) {
            count += 1;
        }
    }
    count
}

fn has_overlapping_range(pair: &Pair) -> bool {
    does_overlap(&pair.0, &pair.1) || does_overlap(&pair.1, &pair.0)
}

fn does_overlap(parent: &Range, child: &Range) -> bool {
    parent.1 >= child.0 && parent.0 <= child.0
}

fn get_num_contained_pairs(pairs: &Pairs) -> u32 {
    let mut count = 0;
    for pair in pairs {
        if has_containing_range(&pair) {
            count += 1;
        }
    }
    count
}

fn has_containing_range(pair: &Pair) -> bool {
    does_contain(&pair.0, &pair.1) || does_contain(&pair.1, &pair.0)
}

fn does_contain(parent: &Range, child: &Range) -> bool {
    parent.0 <= child.0 && parent.1 >= child.1
}

fn parse_input(file: &str) -> Pairs {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");
    input
        .lines()
        .map(|line| {
            let pair: Vec<String> = line.split(',').map(String::from).collect();
            let pair: Vec<(u32, u32)> = pair
                .into_iter()
                .map(|elf| {
                    let range: Vec<u32> =
                        elf.split('-').map(|x| x.parse::<u32>().unwrap()).collect();
                    (range[0].clone(), range[1].clone())
                })
                .collect();
            (pair[0].clone(), pair[1].clone())
        })
        .collect()
}
