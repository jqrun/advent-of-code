#[macro_use]
extern crate lazy_static;

use std::collections::HashMap;
use std::fs;

lazy_static! {
    static ref WIN_MAP: HashMap<String, String> = HashMap::from([
        (String::from("A"), String::from("C")), // Rock > Scissors
        (String::from("B"), String::from("A")), // Paper > Rock
        (String::from("C"), String::from("B")), // Scissors > Paper
    ]);

    static ref LOSE_MAP: HashMap<String, String> = HashMap::from([
        (String::from("A"), String::from("B")), // Rock < Paper
        (String::from("B"), String::from("C")), // Paper > Scissors
        (String::from("C"), String::from("A")), // Scissors < Rock
    ]);

    static ref VAL_MAP: HashMap<String, i32> = HashMap::from([
        (String::from("A"), 1),
        (String::from("B"), 2),
        (String::from("C"), 3),
    ]);

    static ref EQUIV_MAP: HashMap<String, String> = HashMap::from([
        (String::from("X"), String::from("A")),
        (String::from("Y"), String::from("B")),
        (String::from("Z"), String::from("C")),
    ]);
}

fn main() {
    let example = parse_input("src/day-02/example.txt");
    let puzzle = parse_input("src/day-02/puzzle.txt");

    println!("{}", get_assumed_strategy_score(&example));
    println!("{}", get_assumed_strategy_score(&puzzle));

    println!("{}", get_real_strategy_score(&example));
    println!("{}", get_real_strategy_score(&puzzle));
}

fn get_real_strategy_score(strat: &Vec<Vec<String>>) -> i32 {
    let mut transcribed: Vec<Vec<String>> = Vec::new();

    for round in strat {
        transcribed.push(Vec::from([
            round[0].clone(),
            get_instructed_shape(round[0].clone(), round[1].clone()),
        ]));
    }

    get_assumed_strategy_score(&transcribed)
}

fn get_instructed_shape(opponent: String, instruction: String) -> String {
    if instruction == "A" {
        WIN_MAP.get(&opponent).unwrap().clone()
    } else if instruction == "B" {
        opponent
    } else {
        LOSE_MAP.get(&opponent).unwrap().clone()
    }
}

fn get_assumed_strategy_score(strat: &Vec<Vec<String>>) -> i32 {
    let mut score = 0;

    for round in strat {
        score += VAL_MAP.get(&round[1]).unwrap().clone();
        score += get_outcome_val(round[1].clone(), round[0].clone());
    }

    score
}

fn get_outcome_val(you: String, opponent: String) -> i32 {
    if WIN_MAP.get(&you).unwrap().clone() == opponent {
        6
    } else if you == opponent {
        3
    } else {
        0
    }
}

fn parse_input(file: &str) -> Vec<Vec<String>> {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");

    input
        .lines()
        .map(|line| {
            let mut pair: Vec<String> = line.split_whitespace().map(str::to_string).collect();
            pair[1] = EQUIV_MAP.get(&pair[1]).unwrap().clone();
            pair
        })
        .collect()
}
