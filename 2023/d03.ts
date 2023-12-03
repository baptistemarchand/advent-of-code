// https://adventofcode.com/2023/day/3 | Run with `deno run --allow-read d03.ts`

import {sum} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt')).split('\n')

const get = (lineIndex: number, i: number) => {
  if (lineIndex < 0 || lineIndex >= lines.length || i < 0 || i >= lines[0].length) {
    return '.'
  }
  return lines[lineIndex][i]
}

const isSymbol = (s: string) => {
  return !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(s)
}

const touchesSymbol = (lineIndex: number, start: number, end: number) => {
  for (let li = lineIndex - 1; li <= lineIndex + 1; li++) {
    for (let i = start - 1; i <= end; i++) {
      if (isSymbol(get(li, i))) {
        return true
      }
    }
  }
  return false
}

const gears: Record<string, number[]> = {}

const addToGears = (lineIndex: number, start: number, end: number) => {
  for (let li = lineIndex - 1; li <= lineIndex + 1; li++) {
    for (let i = start - 1; i <= end; i++) {
      const key = `${li}_${i}`
      if (get(li, i) === '*') {
        gears[key] ??= []
        gears[key].push(parseInt(lines[lineIndex].slice(start, end)))
      }
    }
  }
}

let start = null
let total = 0

const processNumber = (lineIndex: number, start: number, end: number) => {
  addToGears(lineIndex, start, end)
  if (touchesSymbol(lineIndex, start, end)) {
    total += parseInt(lines[lineIndex].slice(start, end))
  }
}

for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  for (let i = 0; i <= lines[lineIndex].length; i++) {
    const e = get(lineIndex, i)
    if (e === '.' || isSymbol(e)) {
      if (start === null) {
        continue
      }
      processNumber(lineIndex, start, i)
      start = null
    } else {
      if (start === null) {
        start = i
      }
    }
  }
}

console.log(
  total,
  Object.values(gears)
    .filter(ns => ns.length === 2)
    .map(ns => ns[0] * ns[1])
    .reduce(sum),
)
