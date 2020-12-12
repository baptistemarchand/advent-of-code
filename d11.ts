// https://adventofcode.com/2020/day/10 | Run with `deno run --allow-read d10.ts`

const next = (
  lines: string[],
  N: number,
  getAdj: (lines: string[], row: number, col: number, dr: number, dc: number) => string,
) => {
  const result = lines.map(line => line.split(''))
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      const d = (dr: number, dc: number) => getAdj(lines, row, col, dr, dc)
      const adj = [d(-1, -1), d(-1, 0), d(-1, 1), d(0, -1), d(0, 1), d(1, -1), d(1, 0), d(1, 1)].filter(Boolean)
      if (lines[row][col] === 'L' && !adj.includes('#')) {
        result[row][col] = '#'
      }
      if (lines[row][col] === '#' && adj.filter(x => x === '#').length >= N) {
        result[row][col] = 'L'
      }
    }
  }
  return result.map(x => x.join(''))
}

const solve = async (N: number, adj: Parameters<typeof next>[2]) => {
  let curr = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean)
  let prev: string[] = []
  while (curr.join('') !== prev.join('')) {
    prev = curr
    curr = next(prev, N, adj)
  }
  const c = curr.join('').split('')
  console.log(c.filter(x => x === '#').length)
}

// part 1
solve(4, (lines, row, col, dr, dc) => lines[row + dr]?.[col + dc])

// part 2
solve(5, (lines, row, col, dr, dc) => {
  let r = row
  let c = col
  do {
    r += dr
    c += dc
  } while (lines[r]?.[c] === '.')
  return lines[r]?.[c]
})

export {} // To prevent isolatedModules error
