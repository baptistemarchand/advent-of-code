// https://adventofcode.com/2023/day/8 | Run with `deno run --allow-read d08.ts`

import {getNumbers, sum} from '../utils.ts'

const histories = (await Deno.readTextFile('./input.txt')).split('\n').map(getNumbers)

const getNextLine = (values: number[]) => {
  const nextNumbers = []
  for (let i = 0; i < values.length - 1; i++) {
    nextNumbers[i] = values[i + 1] - values[i]
  }
  return nextNumbers
}

const predict = (values: number[]): number => {
  if (values.every(v => v === 0)) {
    return 0
  }

  if (true) {
    // part 1
    return values.at(-1)! + predict(getNextLine(values))
  } else {
    // part 2
    return values.at(0)! - predict(getNextLine(values))
  }
}

console.log(histories.map(predict).reduce(sum))
