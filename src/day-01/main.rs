use std::cmp;
use std::fs;

fn main() {
    println!("{}", get_most_cals(parse_input("src/day-01/example.txt")));
    println!("{}", get_most_cals(parse_input("src/day-01/puzzle.txt")));

    println!("{}", get_top_3_cals(parse_input("src/day-01/example.txt")));
    println!("{}", get_top_3_cals(parse_input("src/day-01/puzzle.txt")));
}

fn get_top_3_cals(inventories: Vec<Vec<i32>>) -> i32 {
    let mut summed: Vec<i32> = inventories
        .iter()
        .map(|inventory| inventory.iter().sum())
        .collect();

    summed.sort();

    summed.iter().rev().take(3).sum()
}

fn get_most_cals(inventories: Vec<Vec<i32>>) -> i32 {
    let mut max: i32 = 0;

    for inventory in inventories {
        let total: i32 = inventory.iter().sum();
        max = cmp::max(total, max);
    }

    max
}

fn parse_input(file: &str) -> Vec<Vec<i32>> {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");

    input
        .split("\n\n")
        .map(|elf| {
            elf.split('\n')
                .map(|cals| cals.parse::<i32>().unwrap())
                .collect()
        })
        .collect()
}
