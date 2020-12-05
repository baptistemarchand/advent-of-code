// Run with `deno run --allow-read d3.ts`

let input = await Deno.readTextFile('input.txt')

const map = input.split('\n')
const width = map[0].length
const height = map.length

const isTree = (x: number, y: number) => map[y][x % width] === '#'

let x = 0
let y = 0
let treeCount = 0

while (y < height) {
  if (isTree(x, y)) {
    treeCount++
  }
  x += 1
  y += 2
}

console.log(treeCount)

export {} // To prevent isolatedModules error
