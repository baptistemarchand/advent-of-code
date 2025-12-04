import chalk from 'jsr:@nothing628/chalk'

export const sum = (a: number, b: number) => a + b
export const mul = (a: number, b: number) => a * b
export const max = Math.max
export const reduceMax = (prev: number, curr: number) => max(prev, curr)
export const reduceMin = (prev: number, curr: number) => min(prev, curr)
export const min = Math.min
export const range = (n: number) => [...Array(n).keys()]

export const getNumbers = (line: string) => [...line.matchAll(/-?\d+/g)].map(m => +m[0])

// -----------------------------[ GRIDS ]-----------------------------

export type Point = {x: number; y: number}
export const point = (x: number, y: number): Point => ({x, y})

export class Grid<T> {
  map: T[][]

  constructor(map: T[][]) {
    this.map = map
  }

  static async create(filename = './input.txt') {
    const map = (await Deno.readTextFile(filename)).split('\n').map(l => l.split(''))
    return new Grid(map)
  }

  at(p: Point): T {
    return this.map[p.y]?.[p.x]
  }

  set(p: Point, value: T) {
    if (!this.map[p.y]) {
      throw Error(`Invalid position in setAt: {x: ${p.x}, y: ${p.y}}`)
    }
    this.map[p.y][p.x] = value
  }

  clone(): Grid<T> {
    return new Grid(this.map.map(row => [...row]))
  }

  walk(fn: (args: {e: T; x: number; y: number; p: Point}) => void) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        fn({x, y, e: this.map[y][x], p: {x, y}})
      }
    }
  }

  print(
    // bg: 0xffffff
    formatter: ({e, p}: {e: T; p: Point}) => {c?: string; bg?: string} = ({e}) => ({c: String(e)}),
    {
      startCol = 0,
    }: {
      startCol?: number
    } = {},
  ) {
    let out = ''
    for (let row = 0; row < this.map.length; row++) {
      for (let col = startCol; col < this.map[0].length; col++) {
        const {c, bg} = formatter({e: this.map[row][col], p: {x: col, y: row}})
        if (bg) {
          out += chalk.bgHex(bg)(c ?? ' ')
        } else {
          out += c ?? ' '
        }
      }
      out += '\n'
    }
    console.log(out)
  }
}

export const adj4 = ({x, y} = {x: 0, y: 0}) => [
  {x: x - 1, y: y + 0}, //  ⬆️ N
  {x: x + 0, y: y - 1}, //  ⬅️ W
  {x: x + 0, y: y + 1}, //   ➡️ E
  {x: x + 1, y: y + 0}, //   ⬇️ S
]
export const adj8 = ({x, y} = {x: 0, y: 0}) => [
  {x: x - 1, y: y + 0}, //  ⬆️ N
  {x: x + 0, y: y - 1}, //  ⬅️ W
  {x: x + 0, y: y + 1}, //   ➡️ E
  {x: x + 1, y: y + 0}, //   ⬇️ S
  {x: x - 1, y: y - 1}, // ↖️  NW
  {x: x - 1, y: y + 1}, //  ↗️  NE
  {x: x + 1, y: y - 1}, //  ↙️ SW
  {x: x + 1, y: y + 1}, //   ↘️ SE
]

export const findPosInGrid = <T>(map: T[][], e: T): {x: number; y: number} => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === e) {
        return {x, y}
      }
    }
  }
  throw Error(`${e} not found in grid`)
}

export const walkGrid = <T>(map: T[][], fn: (args: {e: T; x: number; y: number; p: Point}) => void) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      fn({x, y, e: map[y][x], p: {x, y}})
    }
  }
}

export const isInside = <T>({map, x, y, p}: {map: T[][]; x?: number; y?: number; p?: Point}) => {
  if (p) {
    return p.x >= 0 && p.y >= 0 && p.x < map[0].length && p.y < map.length
  }
  return x! >= 0 && y! >= 0 && x! < map[0].length && y! < map.length
}

export const printGrid = <T>(
  grid: T[][],
  formatter: (e: T, row: number, col: number) => {c?: string; bg?: string} = e => ({c: String(e)}),
  {
    startCol = 0,
  }: {
    cursor?: boolean
    startCol?: number
  } = {},
) => {
  let out = ''
  for (let row = 0; row < grid.length; row++) {
    for (let col = startCol; col < grid[0].length; col++) {
      const {c, bg} = formatter(grid[row][col], row, col)
      if (bg) {
        out += chalk.bgHex(bg)(c ?? ' ')
      } else {
        out += c ?? ' '
      }
    }
    out += '\n'
  }
  console.log(out)
}

// -----------------------------[ MATHS ]-----------------------------

export const leastCommonMultiple = (ns: number[]) => {
  const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b))
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

  let multiple = min(...ns)
  ns.forEach(n => {
    multiple = lcm(multiple, n)
  })

  return multiple
}

type Equation = {
  a: number
  b: number
  r: number
}
// Cramer equations system
// Solve a system of two equations of the form :
// ax + by = r
export const solveTwoEquations = (e1: Equation, e2: Equation) => {
  const determinant = e1.a * e2.b - e1.b * e2.a

  if (determinant === 0) {
    // No solution
    return null
  }

  const x = (e1.r * e2.b - e1.b * e2.r) / determinant
  const y = (e1.a * e2.r - e1.r * e2.a) / determinant

  return {x, y}
}

// a % b but works with negative a
export const modulo = (a: number, b: number) => ((a % b) + b) % b
