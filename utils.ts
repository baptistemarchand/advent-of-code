import {bgRgb8} from 'https://deno.land/std@0.167.0/fmt/colors.ts'
import {writeAllSync} from 'https://deno.land/std/streams/write_all.ts'

export const sum = (a: number, b: number) => a + b
export const mul = (a: number, b: number) => a * b
export const max = Math.max
export const reduceMax = (prev: number, curr: number) => max(prev, curr)
export const reduceMin = (prev: number, curr: number) => min(prev, curr)
export const min = Math.min

export const getNumbers = (line: string) => [...line.matchAll(/-?\d+/g)].map(m => +m[0])

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

export const leastCommonMultiple = (ns: number[]) => {
  const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b))
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

  let multiple = min(...ns)
  ns.forEach(n => {
    multiple = lcm(multiple, n)
  })

  return multiple
}
