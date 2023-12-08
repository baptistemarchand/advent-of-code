// https://adventofcode.com/2023/day/5 | Run with `deno run --allow-read d05.ts`

import {min} from '../utils.ts'

const [seedSection, ...mapSections] = (await Deno.readTextFile('./input.txt')).split('\n\n')

// const seeds = [...seedSection.matchAll(/\d+/g)].map(m => +m[0])

type Range = {min: number; max: number; len: number}
type Map = {
  from: string
  to: string
  tunnels: {
    src: Range
    dst: Range
    delta: number
  }[]
}

const maps = mapSections.map((section): Map => {
  const [header, ...lines] = section.split('\n')
  const [_, from, to] = header.match(/(\w+)-to-(\w+)/)!
  return {
    from,
    to,
    tunnels: lines.map(line => {
      const [dstStart, srcStart, len] = line.split(' ').map(Number)
      return {
        src: {min: srcStart, max: srcStart + len - 1, len},
        dst: {min: dstStart, max: dstStart + len - 1, len},
        delta: dstStart - srcStart,
      }
    }),
  }
})

const seedRanges = [...seedSection.matchAll(/(\d+) (\d+)/g)].map(m => [+m[1], +m[2]])

const intersect = (a: Range, b: Range) => a.max >= b.min && a.min <= b.max

// const getNext = (value: number, type: string): [number, string] => {
//   // console.log(`processing ${value} ${type}`)
//   const map = maps.find(m => m.from === type)
//   if (!map) {
//     throw Error('No map')
//   }
//   const range = map.ranges.find(range => value >= range.srcStart && value < range.srcStart + range.len)
//   if (!range) {
//     return [value, map.to]
//   }

//   return [range.dstStart + (value - range.srcStart), map.to]
// }

const r = (min: number, max: number): Range => {
  if (max < min) {
    console.log(min, max)
    throw Error('zob')
  }
  return {
    min,
    max,
    len: max - min + 1,
  }
}

const splitRange = (range: Range, intersectingRange: Range): Range[] => {
  if (!intersect(range, intersectingRange)) {
    return [range]
  }
  // if (range.len === 1) {
  //   return [range]
  // }
  // console.log(`Splitting range`, range, intersectingRange)

  // const points = [...cutPoints.filter(cp => cp >= range.min && cp <= range.max), range.max].sort()

  // const ranges: Range[] = []

  // let prev = range.min - 1
  // for (const point of points) {
  //   ranges.push(r(prev + 1, point))
  //   prev = point
  // }

  if (range.min >= intersectingRange.min && range.max <= intersectingRange.max) {
    return [range]
  }
  if (range.min < intersectingRange.min && range.max > intersectingRange.max) {
    return [r(range.min, intersectingRange.min - 1), intersectingRange, r(intersectingRange.max + 1, range.max)]
  }
  if (range.min === intersectingRange.min && range.max > intersectingRange.max) {
    return [r(range.min, intersectingRange.max), r(intersectingRange.max + 1, range.max)]
  }
  if (range.max === intersectingRange.max && range.min < intersectingRange.min) {
    return [r(range.min, intersectingRange.min - 1), r(intersectingRange.min, range.max)]
  }
  if (range.min < intersectingRange.min) {
    return [r(range.min, intersectingRange.min - 1), r(intersectingRange.min, range.max)]
  }
  if (range.min > intersectingRange.min) {
    return [r(range.min, intersectingRange.max), r(intersectingRange.max + 1, range.max)]
  }
  throw Error('oops')
  // return ranges
}

const cache: Record<string, {min: number; max: number; value: number}[]> = {
  seed: [],
  soil: [],
  fertilizer: [],
  water: [],
  light: [],
  temperature: [],
  humidity: [],
}

const getMinValue = (range: Range, type: string): number => {
  // console.log(`getMinValue()`, type, range)

  if (type === 'location') {
    return range.min
  }

  const map = maps.find(m => m.from === type)
  if (!map) {
    throw Error('No map')
  }

  const cacheEntry = cache[type].find(entry => entry.min <= range.min && entry.max >= range.max)
  if (cacheEntry) {
    console.log('Using cache')

    return cacheEntry.value
  }

  const intersectingTunnels = map.tunnels.filter(tunnel => intersect(tunnel.src, range))
  // console.log(intersectingTunnels)

  if (intersectingTunnels.length === 0) {
    const result = getMinValue(range, map.to)
    cache[type].push({min: range.min, max: range.max, value: result})
    return result
  }

  // const cutPoints = [...new Set(intersectingTunnels.flatMap(tunnel => [tunnel.src.min, tunnel.src.max]))]

  let newRanges = [range]
  for (const intersectingTunnel of intersectingTunnels) {
    newRanges = newRanges.flatMap(r => splitRange(r, intersectingTunnel.src))
  }

  // console.log('newRanges', newRanges)

  if (newRanges.length > 1) {
    const result = min(...newRanges.map(r => getMinValue(r, type)))
    cache[type].push({min: range.min, max: range.max, value: result})
    return result
  }

  const newRange = newRanges[0]
  const delta = intersectingTunnels[0].delta

  const result = getMinValue({min: newRange.min + delta, max: newRange.max + delta, len: newRange.len}, map.to)
  cache[type].push({min: range.min, max: range.max, value: result})
  return result
}

// const getMin = (seed: number) => {
//   let type = 'seed'
//   let value = seed
//   while (type !== 'location') {
//     const [v, t] = getNext(value, type)
//     value = v
//     type = t
//   }

//   return value
// }

// let ans = Infinity

// for (const seedRange of seedRanges) {
//   for (let i = seedRange[0]; i < seedRange[0] + seedRange[1]; i++) {
//     const m = getMin(i)
//     if (ans > m) {
//       ans = m
//     }
//   }
// }

// console.log(ans)

// const locations = seeds.map(getMin)

// console.log(min(...locations))

// const locations = seedRanges.slice(0, 1).map(seedRange => {
//   let type = 'seed'
//   // console.log('\n----')
//   // console.log(seed, 'seed')
//   let ranges = [{start: seedRange[0], len: seedRange[1]}]

//   while (type !== 'location') {
//     const result = getRanges(ranges, type)
//     console.log(ranges, type, result)

//     type = result.type
//     ranges = result.ranges
//   }

//   return ranges
// })
const ranges = seedRanges.map(seedRange => r(seedRange[0], seedRange[0] + seedRange[1] - 1))

const mins = ranges.map(range => getMinValue(range, 'seed'))

console.log(min(...mins))

// console.log(splitRange(r(93, 98), r(93, 96)))
