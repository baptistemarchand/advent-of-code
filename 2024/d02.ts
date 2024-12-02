// https://adventofcode.com/2024/day/2 | Run with `deno run --allow-read d02.ts`

import {getNumbers} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt')).split('\n')

const getDirection = (a: number, b: number) => (a < b ? 'asc' : 'desc')

const isValid = (ns: number[]) => {
  const direction = getDirection(ns[0], ns[1])

  for (let i = 0; i < ns.length - 1; i++) {
    const gap = Math.abs(ns[i] - ns[i + 1])

    if (gap < 1 || gap > 3) {
      return false
    }

    if (getDirection(ns[i], ns[i + 1]) !== direction) {
      return false
    }
  }

  return true
}

const part1 = lines.filter(line => isValid(getNumbers(line))).length
console.log(part1)

const part2 = lines.filter(line => {
  const ns = getNumbers(line)
  if (isValid(ns)) {
    return true
  }

  for (let i = 0; i < ns.length; i++) {
    if (isValid(ns.filter((_, j) => i !== j))) {
      return true
    }
  }
}).length
console.log(part2)
