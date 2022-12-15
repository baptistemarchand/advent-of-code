// https://adventofcode.com/2022/day/14 | Run with `deno run --allow-read d14.ts`
import {printGrid, min, max} from '../utils.ts'

const lines = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(line => line.split(' -> ').map(a => a.split(',').map(Number)))

const rows = lines.flatMap(steps => steps.map(step => step[1]))
const cols = lines.flatMap(steps => steps.map(step => step[0]))
const maxRow = max(...rows) + 2
const minCol = min(...cols)
const maxCol = max(...cols)

const map: string[][] = []

const set = (row: number, col: number, value: string) => {
  if (!map[row]) {
    map[row] = []
  }
  map[row][col] = value
}

for (let row = 0; row <= maxRow; row++) {
  for (let col = minCol; col <= maxCol; col++) {
    set(row, col, row === maxRow ? '#' : '.')
  }
}

for (const steps of lines) {
  for (let i = 0; i < steps.length - 1; i++) {
    const [xa, ya] = steps[i]
    const [xb, yb] = steps[i + 1]

    for (let y = min(ya, yb); y <= max(ya, yb); y++) {
      set(y, xa, '#')
    }
    for (let x = min(xa, xb); x <= max(xa, xb); x++) {
      set(ya, x, '#')
    }
  }
}

let curr = {row: 0, col: 500}

const isEmpty = ({row, col}: {row: number; col: number}) => !['#', 'o'].includes(map[row]?.[col])
// For part 2 :
// && row < maxRow

const move = () => {
  const candidates = [
    {row: curr.row + 1, col: curr.col},
    {row: curr.row + 1, col: curr.col - 1},
    {row: curr.row + 1, col: curr.col + 1},
  ]
  for (const candidate of candidates) {
    if (isEmpty(candidate)) {
      curr = candidate
      return true
    }
  }
  return false
}

let total = 0
while (true) {
  if (move()) {
    if (curr.row > maxRow) {
      break
    }
  } else {
    total++
    if (curr.row === 0 && curr.col === 500) {
      break
    }
    set(curr.row, curr.col, 'o')
    curr = {row: 0, col: 500}
  }
}

printGrid(
  map,
  (value, row, col) => ({
    bg: (() => {
      if (row === curr.row && col === curr.col) {
        return 220
      }
      if (value === '#') {
        return 4
      }
      if (value === 'o') {
        return 220
      }
      return 0
    })(),
  }),
  {
    startCol: minCol,
  },
)

console.log(total)
