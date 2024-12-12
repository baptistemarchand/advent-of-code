import {sumOf} from '@std/collections'
import {getNumbers} from '../utils.ts'

const ns = getNumbers(await Deno.readTextFile('./input.txt'))

const cache: Record<string, number> = {}

const countStones = (ns: number[], depth: number, total = 0): number => {
  if (depth <= 0) {
    return ns.length
  }

  return sumOf(ns, n => {
    const key = `${n}_${depth}`

    if (cache[key]) {
      return cache[key]
    }

    if (n === 0) {
      return (cache[key] = countStones([1], depth - 1, total))
    }

    const s = n.toString()
    if (s.length % 2 === 0) {
      const a = parseInt(s.slice(0, s.length / 2), 10)
      const b = parseInt(s.slice(s.length / 2), 10)
      return (cache[key] = countStones([a, b], depth - 1, total))
    }

    return countStones([2024 * n], depth - 1, total)
  })
}

console.log(countStones(ns, 25))
console.log(countStones(ns, 75))
