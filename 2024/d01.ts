// https://adventofcode.com/2024/day/1 | Run with `deno run --allow-read d01.ts`

import {getNumbers, zip} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt')).split('\n')

const as: number[] = []
const bs: number[] = []
const count: Record<number, number> = {}

for (const line of lines) {
  const [a, b] = getNumbers(line)
  as.push(a)
  bs.push(b)

  count[b] ??= 0
  count[b]++
}

as.sort()
bs.sort()

const part1 = zip(as, bs).reduce((total, [a, b]) => total + Math.abs(a - b), 0)
console.log(part1)

const part2 = as.reduce((total, a) => total + a * (count[a] ?? 0), 0)
console.log(part2)
