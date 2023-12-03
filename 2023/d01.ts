// https://adventofcode.com/2023/day/1 | Run with `deno run --allow-read d01.ts`

import {sum} from '../utils.ts'

const result1 = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(line => {
    const witoutLetters = line.split('').filter(c => !isNaN(c as any))
    const firstDigit = witoutLetters[0]
    const lastDigit = witoutLetters.slice(-1)
    return parseInt(`${firstDigit}${lastDigit}`)
  })
  .reduce(sum)

const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const getDigit = (line: string) => {
  if (!isNaN(line[0] as any)) {
    return line[0]
  }

  for (let w = 0; w < words.length; w++) {
    if (line.startsWith(words[w])) {
      return `${w + 1}`
    }
  }

  return undefined
}

const firstDigit = (line: string) => {
  for (let i = 0; i < line.length; i++) {
    const digit = getDigit(line.slice(i))
    if (digit) {
      return digit
    }
  }
}

const lastDigit = (line: string) => {
  for (let i = line.length - 1; i >= 0; i--) {
    const digit = getDigit(line.slice(i))
    if (digit) {
      return digit
    }
  }
}

const result2 = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(line => {
    return parseInt(`${firstDigit(line)}${lastDigit(line)}`)
  })
  .reduce(sum)

console.log(result2)
