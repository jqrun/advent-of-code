use regex::Regex;
use std::fs;

type Stack = Vec<char>;

#[derive(Debug)]
struct Move {
    from: usize,
    to: usize,
    amount: usize,
}

#[derive(Debug)]
struct Procedure {
    stacks: Vec<Stack>,
    moves: Vec<Move>,
}

fn main() {
    let example = parse_input("src/day-05/example.txt");
    let puzzle = parse_input("src/day-05/puzzle.txt");

    println!("{}", run_procedure(&example));
    println!("{}", run_procedure(&puzzle));

    println!("{}", run_procedure_9001(&example));
    println!("{}", run_procedure_9001(&puzzle));
}

fn run_procedure(procedure: &Procedure) -> String {
    let mut stacks: Vec<Stack> = procedure.stacks.clone();
    for mv in &procedure.moves {
        for _ in 0..mv.amount {
            let moved = stacks[mv.from - 1].pop().unwrap();
            stacks[mv.to - 1].push(moved)
        }
    }

    String::from_iter(
        stacks
            .iter()
            .filter(|x| x.len() > 0)
            .map(|x| x[x.len() - 1]),
    )
}

fn run_procedure_9001(procedure: &Procedure) -> String {
    let mut stacks: Vec<Stack> = procedure.stacks.clone();
    for mv in &procedure.moves {
        let from_len = stacks[mv.from - 1].len();
        let mut moved = stacks[mv.from - 1].split_off(from_len - mv.amount);
        stacks[mv.to - 1].append(&mut moved);
    }

    String::from_iter(
        stacks
            .iter()
            .filter(|x| x.len() > 0)
            .map(|x| x[x.len() - 1]),
    )
}

fn parse_input(file: &str) -> Procedure {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");
    let input: Vec<&str> = input.split("\n\n").collect();

    let stack_lines: Vec<&str> = input[0].split("\n").collect();
    let move_lines: Vec<&str> = input[1].split("\n").collect();

    let mut stacks: Vec<Stack> = Vec::new();
    let mut moves: Vec<Move> = Vec::new();

    for _ in 0..((stack_lines[0].len() - 1) / 3) {
        stacks.push(Vec::new())
    }

    for line in stack_lines {
        if !line.contains('[') {
            break;
        }

        for (i, char) in line.chars().enumerate() {
            if i % 4 != 1 {
                continue;
            }

            if char.is_alphabetic() {
                stacks[((i + 3) / 4) - 1].insert(0, char);
            }
        }
    }

    let regex = Regex::new(r"\D+").expect("Invalid regex");
    for line in move_lines {
        let nums: Vec<usize> = regex
            .split(line)
            .filter(|x| x.len() > 0)
            .map(|x| x.parse::<usize>().unwrap())
            .collect();

        moves.push(Move {
            from: nums[1],
            to: nums[2],
            amount: nums[0],
        })
    }

    Procedure { stacks, moves }
}
