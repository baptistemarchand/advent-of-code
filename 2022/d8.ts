// https://adventofcode.com/2022/day/7 | Run with `deno run --allow-read d7.ts`

const grid = (await Deno.readTextFile('./input.txt')).split('\n').map(line => line.split('').map(Number))

const getNearTrees = (row: number, col: number) => {
  const left = grid[row].slice(0, col).reverse()
  const right = grid[row].slice(col + 1)
  const top = []
  for (let i = row - 1; i >= 0; i--) {
    top.push(grid[i][col])
  }
  const bottom = []
  for (let i = row + 1; i < grid.length; i++) {
    bottom.push(grid[i][col])
  }

  return [left, right, bottom, top]
}

const isVisible = (row: number, col: number) =>
  getNearTrees(row, col).some(trees => trees.every(h => h < grid[row][col]))

const getScore = (row: number, col: number) =>
  getNearTrees(row, col)
    .map(trees => {
      let count = 0
      for (const tree of trees) {
        if (tree >= grid[row][col]) {
          return count + 1
        }
        count++
      }
      return count
    })
    .reduce((a, b) => a * b)

let visibleCount = 0
let maxScore = 0

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (isVisible(row, col)) {
      visibleCount++
    }
    const score = getScore(row, col)
    if (score > maxScore) {
      maxScore = score
    }
  }
}

console.log(visibleCount, maxScore)
