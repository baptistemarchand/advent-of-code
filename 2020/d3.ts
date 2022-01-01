// https://adventofcode.com/2020/day/3 | Run with `deno run --allow-read d3.ts`

const map = (await Deno.readTextFile('input.txt')).split('\n')

const go = (dx: number, dy: number) => {
  let x = 0
  let y = 0
  let treeCount = 0

  while (y < map.length) {
    treeCount += map[y][x % map[0].length] === '#' ? 1 : 0
    x += dx
    y += dy
  }

  return treeCount
}

// part 1
console.log(go(3, 1))

// part 2
console.log(go(1, 1) * go(3, 1) * go(5, 1) * go(7, 1) * go(1, 2))

export {} // To prevent isolatedModules error
