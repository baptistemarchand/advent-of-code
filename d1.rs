// https://adventofcode.com/2020/day/1
use std::io::{BufRead, BufReader};
use std::fs::File;

pub fn ex1() {
    let reader = BufReader::new(File::open("input.txt").expect("Cannot open file.txt"));

    let mut vec = Vec::new();
    for line in reader.lines() {
        let x: i32 = line.unwrap().parse().unwrap();
        vec.push(x)
    }

    for i in &vec {
        for j in &vec {
            for a in &vec {
            let total = i + j + a;
                if total == 2020 {
                    println!("{}",i*j*a);
                }
            }
        }
    }
}