// https://adventofcode.com/2022/day/3 | Run with `deno run --allow-read d3.ts`

import {sum} from '../utils.ts'

const getPriority = (letter: string) => '0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(letter)

const lines = (await Deno.readTextFile('./input.txt')).split('\n')

const part1 = lines
  .map(line => {
    const middle = line.length / 2
    const firstHalf = line.slice(0, middle)
    const secondHalf = line.slice(middle)
    return [...firstHalf].find(letter => secondHalf.includes(letter))!
  })
  .map(getPriority)
  .reduce(sum)

console.log(part1)

let total = 0
for (let i = 0; i < lines.length; i += 3) {
  const a = lines[i]
  const b = lines[i + 1]
  const c = lines[i + 2]
  const commonLetter = [...a].find(letter => b.includes(letter) && c.includes(letter))
  total += getPriority(commonLetter!)
}
console.log(total)
