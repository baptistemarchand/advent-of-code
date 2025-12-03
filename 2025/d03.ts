import {sum} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt')).split('\n')
const banks = lines.map(line => line.split('').map(Number))

const NUMBER_OF_DIGITS = 12 // 2 for part 1

const getMaxJolt = (bank: number[]) => {
  let result = 0
  let lastIndex = -1

  for (let i = NUMBER_OF_DIGITS - 1; i >= 0; i--) {
    const possibleDigits = bank.slice(lastIndex + 1, bank.length - i)
    const digit = Math.max(...possibleDigits)
    result += digit * 10 ** i
    lastIndex += 1 + possibleDigits.findIndex(x => x === digit)
  }

  return result
}

console.log(banks.map(getMaxJolt).reduce(sum))
