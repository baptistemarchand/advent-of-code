import {bgRgb8} from 'https://deno.land/std@0.167.0/fmt/colors.ts'
import {writeAllSync} from 'https://deno.land/std/streams/write_all.ts'

export const sum = (a: number, b: number) => a + b
export const mul = (a: number, b: number) => a * b
export const max = Math.max
export const min = Math.min

const cursorUp = (n: number) => {
  writeAllSync(Deno.stdout, new TextEncoder().encode(`\u001b[${n + 1}A`))
}

export const printGrid = <T>(
  grid: T[][],
  formatter: (e: T, row: number, col: number) => {c?: string; bg: number},
  {
    cursor = false,
    startCol = 0,
  }: {
    cursor?: boolean
    startCol?: number
  } = {},
) => {
  if (cursor) {
    cursorUp(grid.length)
  }
  let out = ''
  for (let row = 0; row < grid.length; row++) {
    for (let col = startCol; col < grid[0].length; col++) {
      const {c, bg} = formatter(grid[row][col], row, col)
      out += bgRgb8(c ?? ' ', bg)
    }
    out += '\n'
  }
  console.log(out)
}
