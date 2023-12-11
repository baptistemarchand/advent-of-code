// https://adventofcode.com/2023/day/11 | Run with `bun d11.ts`

import {max, min, sum} from '../utils'

const grid = (await Bun.file('./input.txt').text()).split('\n')

let emptyRows: number[] = grid.map((_, i) => i)
let emptyCols: number[] = grid[0].split('').map((_, i) => i)

type Galaxy = {row: number; col: number}
const galaxies: Galaxy[] = []

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === '#') {
      emptyRows = emptyRows.filter(r => r !== row)
      emptyCols = emptyCols.filter(c => c !== col)
      galaxies.push({row, col})
    }
  }
}

const getDistance = (a: Galaxy, b: Galaxy) => {
  const emptyRowsCount = emptyRows.filter(r => r < max(a.row, b.row) && r > min(a.row, b.row)).length
  const emptyColsCount = emptyCols.filter(c => c < max(a.col, b.col) && c > min(a.col, b.col)).length

  const M = 1000000 // for part 1, put 2 here

  const dRow = Math.abs(a.row - b.row) + emptyRowsCount * (M - 1)
  const dCol = Math.abs(a.col - b.col) + emptyColsCount * (M - 1)

  return dRow + dCol
}

const distances: Record<string, number> = {}

for (const [ia, ga] of galaxies.entries()) {
  for (const [ib, gb] of galaxies.entries()) {
    const k = `${min(ia, ib)}_${max(ia, ib)}`
    if (ia === ib || distances[k]) {
      continue
    }

    distances[k] = getDistance(ga, gb)
  }
}

console.log(Object.values(distances).reduce(sum))
