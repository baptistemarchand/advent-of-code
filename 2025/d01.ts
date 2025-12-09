import {getInput, validate} from '../utils.ts'

const lines = (await getInput('d01')).split('\n')

let x = 50
let part1 = 0
let part2 = 0

for (const line of lines) {
  const n = Number(line.slice(1))
  const inc = line[0] === 'R' ? 1 : -1

  for (let i = 0; i < n; i++) {
    x += inc

    if (x % 100 === 0) {
      part2++
    }
  }

  if (x % 100 === 0) {
    part1++
  }
}

validate('2025/d01', part1, 1023, part2, 5899)
