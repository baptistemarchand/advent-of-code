import {getInput, sum, validate} from '../utils.ts'

const lines = (await getInput('d03')).split('\n')
const banks = lines.map(line => line.split('').map(Number))

const getMaxJolt = (bank: number[], numberOfDigits: 2 | 12) => {
  let result = 0
  let lastIndex = -1

  for (let i = numberOfDigits - 1; i >= 0; i--) {
    const possibleDigits = bank.slice(lastIndex + 1, bank.length - i)
    const digit = Math.max(...possibleDigits)
    result += digit * 10 ** i
    lastIndex += 1 + possibleDigits.findIndex(x => x === digit)
  }

  return result
}

const part1 = banks.map(b => getMaxJolt(b, 2)).reduce(sum)
const part2 = banks.map(b => getMaxJolt(b, 12)).reduce(sum)

validate('2025/d03', part1, 17301, part2, 172162399742349)
