import {sumOf} from '@std/collections'
import {getNumbers} from '../utils.ts'

const ns = getNumbers(await Deno.readTextFile('./input.txt'))

const next = (n: number): number[] => {
  if (n === 0) {
    return [1]
  }

  const s = n.toString()
  if (s.length % 2 === 0) {
    const a = parseInt(s.slice(0, s.length / 2), 10)
    const b = parseInt(s.slice(s.length / 2), 10)
    return [a, b]
  }

  return [2024 * n]
}

const cache: Record<string, number> = {}

const count = (ns: number[], depth: number): number => {
  if (depth <= 0) {
    return ns.length
  }

  return sumOf(ns, n => {
    const key = `${n}_${depth}`

    if (!cache[key]) {
      cache[key] = count(next(n), depth - 1)
    }

    return cache[key]
  })
}

console.log(count(ns, 25))
console.log(count(ns, 75))
