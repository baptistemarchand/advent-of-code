import {sumOf} from '@std/collections'

const input = await Deno.readTextFile('./input.txt')

const getTotal = (line: string) => sumOf([...line.matchAll(/mul\((\d+),(\d+)\)/g)], m => +m[1] * +m[2])

const part1 = getTotal(input)
console.log(part1)

let part2 = 0
let enabled = true

for (const chunk of input.split(/(don't\(\)|do\(\))/)) {
  if (chunk === "don't()") {
    enabled = false
  } else if (chunk === 'do()') {
    enabled = true
  } else if (enabled) {
    part2 += getTotal(chunk)
  }
}

console.log(part2)
