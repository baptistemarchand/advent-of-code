use std::io::{BufRead, BufReader};
use std::fs::File;

#[derive(Debug)]
struct Entry {
    password: String,
    letter: char,
    pos1: u32,
    pos2: u32,
}

pub fn ex1() {
    let reader = BufReader::new(File::open("input.txt").expect("Cannot open file.txt"));

    let mut result = 0u32;

    for line in reader.lines() {
        let l = String::from(line.unwrap());
        let v: Vec<&str> = l.split(' ').collect();
        let x: Vec<&str> = v[0].split('-').collect();
        let e = Entry{
            password: String::from(v[2]),
            letter: v[1].chars().next().unwrap(),
            pos1: x[0].parse().unwrap(),
            pos2: x[1].parse().unwrap()
        };
        let mut pos = 0u32;
        let mut matches = 0u32;
        for c in e.password.chars() {
            pos += 1;
            if c == e.letter && (e.pos1 == pos || e.pos2 == pos) {
                matches += 1
            }
        }
        let ok = matches == 1;
        if ok {
            result += 1
        }
        print!("{:?} {}\n", e, ok)
}

    print!("{:?}\n", result)
}