import {partition} from '@std/collections/partition'
import {getInput, max, min, overlap, type Range, validate} from '../utils.ts'

const [rangesRaw, idsRaw] = (await getInput('d05')).split('\n\n')
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

const part1 = ids.filter(isFresh).length

let cleanRanges: Range[] = [] // Non overlapping ranges

for (const range of ranges) {
  const [overlappingRanges, newCleanRanges] = partition(cleanRanges, r => overlap(range, r))

  const minFrom = min(range.from, ...overlappingRanges.map(r => r.from))
  const maxTo = max(range.to, ...overlappingRanges.map(r => r.to))
  cleanRanges = [...newCleanRanges, {from: minFrom, to: maxTo}]
}

const part2 = cleanRanges.reduce((total, {from, to}) => total + 1 + (to - from), 0)

validate('2025/d05', part1, 756, part2, 355555479253787)
