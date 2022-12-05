// https://adventofcode.com/2022/day/4 | Run with `deno run --allow-read d4.ts`

type Range = [number, number]

const contains = ([minA, maxA]: Range, [minB, maxB]: Range) => minA <= minB && maxA >= maxB
const overlaps = ([minA, maxA]: Range, [minB, maxB]: Range) => maxA >= minB && maxB >= minA

const result = (await Deno.readTextFile('./input.txt')).split('\n').filter(line => {
  const [a, b] = line.split(',').map(r => r.split('-').map(Number) as Range)
  // return contains(a, b) || contains(b, a)
  return overlaps(a, b)
}).length

console.log(result)
