use std::collections::HashMap;
use std::fs;

fn main() {
    let example = parse_input("src/day-06/example.txt");
    let puzzle = parse_input("src/day-06/puzzle.txt");

    println!("{}", get_count_till_distinct_n(&example, 4));
    println!("{}", get_count_till_distinct_n(&puzzle, 4));

    println!("{}", get_count_till_distinct_n(&example, 14));
    println!("{}", get_count_till_distinct_n(&puzzle, 14));
}

fn get_count_till_distinct_n(subroutine: &Vec<char>, n: usize) -> usize {
    let mut count_map: HashMap<char, usize> = HashMap::new();

    let mut left = subroutine[0];

    for i in 0..(n - 1) {
        count_map
            .entry(subroutine[i])
            .and_modify(|c| *c += 1)
            .or_insert(1);
    }

    for i in (n - 1)..subroutine.len() {
        count_map
            .entry(subroutine[i])
            .and_modify(|c| *c += 1)
            .or_insert(1);

        if count_map.len() == n {
            return i + 1;
        }

        count_map.entry(left).and_modify(|c| *c -= 1);
        if *count_map.get(&left).unwrap() == 0 {
            count_map.remove(&left);
        }
        left = subroutine[i - (n - 2)];
    }

    subroutine.len()
}

fn parse_input(file: &str) -> Vec<char> {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");
    input.chars().collect()
}
