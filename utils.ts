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

export const adj4 = ({x, y} = {x: 0, y: 0}) => [
  {x: x - 1, y: y + 0}, //  ⬆️ N
  {x: x + 0, y: y - 1}, //  ⬅️ W
  {x: x + 0, y: y + 1}, //   ➡️ E
  {x: x + 1, y: y + 0}, //   ⬇️ S
]
export const adj8 = [
  [-1, -1], // ↖️  NW
  [-1, 0], //  ⬆️ N
  [-1, 1], //  ↗️  NE
  [0, -1], //  ⬅️ W
  [0, 1], //   ➡️ E
  [1, -1], //  ↙️ SW
  [1, 0], //   ⬇️ S
  [1, 1], //   ↘️ SE
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
      out += c ?? ' '
      // out += chalk.bgHex(bg)(c ?? ' ')
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
