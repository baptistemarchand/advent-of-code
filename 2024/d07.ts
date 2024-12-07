import {sumOf} from '@std/collections'
import {getNumbers} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt')).split('\n').map(getNumbers)

const solve = (ops: Array<(a: number, b: number) => number>) => {
  const getResults = (ns: number[]): number[] => {
    if (ns.length === 1) {
      return [ns[0]]
    }

    return getResults(ns.slice(1)).flatMap(result => ops.map(op => op(result, ns[0])))
  }

  return sumOf(
    lines.filter(([total, ...parts]) => getResults(parts.reverse()).some(p => p === total)),
    ([total]) => total,
  )
}

const part1 = solve([(a, b) => a + b, (a, b) => a * b])
const part2 = solve([(a, b) => a + b, (a, b) => a * b, (a, b) => +`${a}${b}`])

console.log(part1, part2)
