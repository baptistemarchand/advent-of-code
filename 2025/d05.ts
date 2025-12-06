import {partition} from '@std/collections/partition'
import {max, min} from '../utils.ts'

const [rangesRaw, idsRaw] = (await Deno.readTextFile('./input.txt')).split('\n\n')
const ranges = rangesRaw.split('\n').map(line => {
  const [from, to] = line.split('-').map(Number)
  return {from, to}
})
const ids = idsRaw.split('\n').map(Number)

const isFresh = (id: number) => {
  for (const {from, to} of ranges) {
    if (id >= from && id <= to) {
      return true
    }
  }
  return false
}

console.log(ids.filter(isFresh).length) // Part 1

type Range = {from: number; to: number}

let cleanRanges: Range[] = [] // Non overlapping ranges

const overlap = (r1: Range, r2: Range) => !(r1.to < r2.from || r2.to < r1.from)

for (const range of ranges) {
  const [overlappingRanges, newCleanRanges] = partition(cleanRanges, r => overlap(range, r))

  const minFrom = min(range.from, ...overlappingRanges.map(r => r.from))
  const maxTo = max(range.to, ...overlappingRanges.map(r => r.to))
  cleanRanges = [...newCleanRanges, {from: minFrom, to: maxTo}]
}

console.log(cleanRanges.reduce((total, {from, to}) => total + 1 + (to - from), 0))
