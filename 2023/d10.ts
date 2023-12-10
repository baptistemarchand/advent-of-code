// https://adventofcode.com/2023/day/10 | Run with `bun d10.ts`

import {max, min, printGrid} from '../utils.ts'

// const grid = (await Deno.readTextFile('./input.txt')).split('\n').map(line => line.split(''))
const grid = (await Bun.file('./input.txt').text()).split('\n').map(line => line.split(''))

const s = (() => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 'S') {
        return {row, col}
      }
    }
  }
})()!

const canConnect = (from: string, to: string, direction: 't' | 'b' | 'l' | 'r') => {
  if (to === '.') {
    return false
  }

  const canGoTop = direction === 't' && ['|', '7', 'F'].includes(to)
  const canGoBottom = direction === 'b' && ['|', 'L', 'J'].includes(to)
  const canGoLeft = direction === 'l' && ['-', 'L', 'F'].includes(to)
  const canGoRight = direction === 'r' && ['-', '7', 'J'].includes(to)

  if (['S', '|'].includes(from)) {
    return canGoTop || canGoBottom
  }
  if (['S', '-'].includes(from)) {
    return canGoLeft || canGoRight
  }
  if (['S', 'L'].includes(from)) {
    return canGoTop || canGoRight
  }
  if (['S', 'J'].includes(from)) {
    return canGoTop || canGoLeft
  }
  if (['S', '7'].includes(from)) {
    return canGoBottom || canGoLeft
  }
  if (['S', 'F'].includes(from)) {
    return canGoBottom || canGoRight
  }

  throw Error('oops')
}

const seen: Record<string, boolean> = {}
const path: {row: number; col: number}[] = []

const getLoopSize = (row: number, col: number, total = 0): number => {
  seen[`${row}_${col}`] = true
  path.push({row, col})
  const currentPipe = grid[row][col]

  const ds = [
    {d: 'l', drow: 0, dcol: -1},
    {d: 'r', drow: 0, dcol: 1},
    {d: 'b', drow: 1, dcol: 0},
    {d: 't', drow: -1, dcol: 0},
  ] as const

  for (const {d, drow, dcol} of ds) {
    const newRow = row + drow
    const newCol = col + dcol

    if (seen[`${newRow}_${newCol}`] || newRow < 0 || newCol < 0 || newRow >= grid.length || newCol >= grid[0].length) {
      continue
    }

    const nextPipe = grid[newRow][newCol]
    if (canConnect(currentPipe, nextPipe, d)) {
      return getLoopSize(newRow, newCol, total + 1)
    }
  }

  return total
}

// part 1
console.log(Math.ceil(getLoopSize(s!.row, s!.col) / 2))

// printGrid(grid, (e, row, col) => {
//   const cm: Record<string, string> = {
//     F: '┏',
//     '-': '━',
//     '|': '┃',
//     L: '┗',
//     7: '┓',
//     J: '┛',
//   }
//   const bg = (() => {
//     if (e === '.') {
//       return '#ff0000'
//     }
//     if (seen[`${row}_${col}`]) {
//       return '#008888'
//     }
//     return '#000'
//   })()
//   return {
//     bg,
//     c: cm[e] ?? e,
//   }
// })

const inside: Record<string, boolean> = {}

const aaa = () => {
  const ball = {
    row: s.row + 1,
    col: s.col - 1,
  }

  for (const [i, {row, col}] of path.entries()) {
    const pipe = grid[row][col]
    const newBall = {...ball}

    if (pipe === '|') {
      newBall.row = row
    }
    if (pipe === '-') {
      newBall.col = col
    }
    if (pipe === 'L') {
      if (ball.col < col) {
        newBall.col = col - 1
        newBall.row = row + 1
      } else if (ball.col >= col && ball.row <= row) {
        newBall.col = col + 1
        newBall.row = row - 1
      }
    }
    if (pipe === 'J') {
      if (ball.col < col && ball.row <= row) {
        newBall.col = col - 1
        newBall.row = row - 1
      } else if (ball.col <= col && ball.row > row) {
        newBall.col = col + 1
        newBall.row = row + 1
      }
    }
    if (pipe === '7') {
      if (ball.row > row && ball.col > col) {
        newBall.col = col + 1
        newBall.row = row - 1
      } else if (ball.row > row) {
        newBall.col = col - 1
        newBall.row = row + 1
      } else if (ball.col >= col && ball.row <= row) {
        newBall.col = col + 1
        newBall.row = row - 1
      }
    }
    if (pipe === 'F') {
      if (ball.row < row) {
        newBall.col = col - 1
        newBall.row = row - 1
      }
      if (ball.col > col && ball.row >= row) {
        newBall.col = col + 1
        newBall.row = row + 1
      }
    }
    inside[`${newBall.row}_${newBall.col}`] = true
    if (newBall.row === ball.row) {
      for (let c = min(newBall.col, ball.col); c <= max(newBall.col, ball.col); c++) {
        inside[`${newBall.row}_${c}`] = true
      }
    }
    if (newBall.col === ball.col) {
      for (let r = min(newBall.row, ball.row); r <= max(newBall.row, ball.row); r++) {
        inside[`${r}_${newBall.col}`] = true
      }
    }
    ball.row = newBall.row
    ball.col = newBall.col

    // printGrid(grid, (e, row_, col_) => {
    //   const cm: Record<string, string> = {
    //     F: '┏',
    //     '-': '━',
    //     '|': '┃',
    //     L: '┗',
    //     7: '┓',
    //     J: '┛',
    //   }
    //   const bg = (() => {
    //     if (row === row_ && col === col_) {
    //       return '#0000ff'
    //     }
    //     if (row_ === ball.row && col_ === ball.col) {
    //       return '#ff0000'
    //     }
    //     // if (e === '.') {
    //     //   return '#ff0000'
    //     // }
    //     if (seen[`${row_}_${col_}`]) {
    //       return '#555500'
    //     }
    //     return '#000'
    //   })()
    //   return {
    //     bg,
    //     c: cm[e] ?? e,
    //   }
    // })
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (seen[`${row}_${col}`]) {
        inside[`${row}_${col}`] = false
      }
      if (seen[`${row}_${col}`] || inside[`${row}_${col}`]) {
        continue
      }
      if (inside[`${row - 1}_${col}`] || inside[`${row}_${col - 1}`]) {
        inside[`${row}_${col}`] = true
      }
    }
  }
}

aaa()

printGrid(grid, (e, row, col) => {
  const cm: Record<string, string> = {
    F: '┏',
    '-': '━',
    '|': '┃',
    L: '┗',
    7: '┓',
    J: '┛',
  }
  const bg = (() => {
    if (seen[`${row}_${col}`]) {
      return '#555500'
    }
    if (inside[`${row}_${col}`]) {
      return '#ff0000'
    }
    return '#000'
  })()
  return {
    bg,
    c: cm[e] ?? e,
  }
})

console.log(Object.entries(inside).filter(([k, v]) => v === true).length)
