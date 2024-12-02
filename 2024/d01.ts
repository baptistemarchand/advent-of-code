// https://adventofcode.com/2024/day/1 | Run with `deno run --allow-read d01.ts`

import {getNumbers} from '../utils.ts'
import {zip, sumOf} from '@std/collections'

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

const part1 = sumOf(zip(as, bs), ([a, b]) => Math.abs(a - b))
console.log(part1)

const part2 = sumOf(as, a => a * (count[a] ?? 0))
console.log(part2)
