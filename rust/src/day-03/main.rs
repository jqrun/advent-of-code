use std::collections::HashMap;
use std::collections::HashSet;
use std::fs;

fn main() {
    let example = parse_input("src/day-03/example.txt");
    let puzzle = parse_input("src/day-03/puzzle.txt");

    println!("{}", sum_duped_priorty(&example));
    println!("{}", sum_duped_priorty(&puzzle));

    println!("{}", sum_group_badges(&example));
    println!("{}", sum_group_badges(&puzzle));
}

fn sum_group_badges(sacks: &Vec<String>) -> u32 {
    let mut sum = 0;
    let mut item_count: HashMap<char, u32> = HashMap::new();

    for (i, sack) in sacks.iter().enumerate() {
        if i % 3 == 0 {
            item_count.clear();
        }

        let mut seen: HashSet<char> = HashSet::new();
        for item in sack.chars() {
            if seen.contains(&item) {
                continue;
            }
            seen.insert(item);

            item_count.entry(item).and_modify(|i| *i += 1).or_insert(1);
            if *item_count.get(&item).unwrap() == 3 {
                sum += get_priority(&item);
            }
        }
    }

    sum
}

fn sum_duped_priorty(sacks: &Vec<String>) -> u32 {
    let mut sum = 0;

    for sack in sacks {
        let mut seen: HashSet<char> = HashSet::new();
        let mid = sack.len() / 2;

        for (i, item) in sack.chars().enumerate() {
            if i < mid {
                seen.insert(item);
            } else if seen.contains(&item) {
                sum += get_priority(&item);
                break;
            }
        }
    }

    sum
}

fn get_priority(item: &char) -> u32 {
    let adjustment = if item.is_uppercase() { 27 } else { 1 };
    u32::from(item.to_lowercase().collect::<Vec<_>>()[0]) - u32::from('a') + adjustment
}

fn parse_input(file: &str) -> Vec<String> {
    let input: String = fs::read_to_string(file).expect("Should have been able to read the file");
    input.lines().map(String::from).collect()
}
