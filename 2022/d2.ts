// https://adventofcode.com/2022/day/3 | Run with `deno run --allow-read d3.ts`

// A/X = rock
// B/Y = paper
// C/Z = Scissors
const scores1: Record<string, number> = {
  'A X': 1 + 3,
  'A Y': 2 + 6,
  'A Z': 3 + 0,
  'B X': 1 + 0,
  'B Y': 2 + 3,
  'B Z': 3 + 6,
  'C X': 1 + 6,
  'C Y': 2 + 0,
  'C Z': 3 + 3,
}

// X = need to loose
// Y = draw
// Z = need to win
const scores2: Record<string, number> = {
  'A X': 0 + 3,
  'A Y': 3 + 1,
  'A Z': 6 + 2,
  'B X': 0 + 1,
  'B Y': 3 + 2,
  'B Z': 6 + 3,
  'C X': 0 + 2,
  'C Y': 3 + 3,
  'C Z': 6 + 1,
}

const result = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(x => scores2[x])
  .reduce((prev, curr) => prev + curr, 0)

console.log(result)
