// https://adventofcode.com/2022/day/7 | Run with `deno run --allow-read d7.ts`

const instructions = (await Deno.readTextFile('./input.txt')).split('\n')

type Knot = {x: number; y: number; isTail: boolean}
const knots: Knot[] = []

const N = 10

for (let i = 0; i < N; i++) {
  knots.push({x: 0, y: 0, isTail: i === N - 1})
}

const print = () => {
  let result = ''
  for (let y = 4; y >= 0; y--) {
    for (let x = 0; x < 6; x++) {
      const char = (() => {
        if (x === knots[0].x && y === knots[0].y) {
          return 'H'
        }
        const k = knots.findIndex(k => k.x === x && k.y === y)
        if (k) {
          return `${k}`
        }
        if (x === 0 && y === 0) {
          return 's'
        }
        return '.'
      })()
      result = `${result}${char}`
    }
    result = `${result}\n`
  }
  console.log(result)
}

const seenByTail = new Set()

const moveHead = (direction: string) => {
  switch (direction) {
    case 'U':
      knots[0].y++
      break
    case 'D':
      knots[0].y--
      break
    case 'L':
      knots[0].x--
      break
    case 'R':
      knots[0].x++
      break
  }
}

const moveSection = (target: Knot, follower: Knot) => {
  const dx = Math.abs(target.x - follower.x)
  const dy = Math.abs(target.y - follower.y)

  if (dy > 1 || (dy === 1 && dx > 1)) {
    follower.y += target.y > follower.y ? 1 : -1
  }
  if (dx > 1 || (dx === 1 && dy > 1)) {
    follower.x += target.x > follower.x ? 1 : -1
  }

  if (follower.isTail) {
    seenByTail.add(`${follower.x}${follower.y}`)
  }
}

for (const instruction of instructions) {
  const [direction, amount] = instruction.split(' ')
  for (let i = 0; i < +amount; i++) {
    moveHead(direction)
    for (let i = 0; i < knots.length - 1; i++) {
      moveSection(knots[i], knots[i + 1])
    }
    // print()
  }
}

console.log(seenByTail.size)
