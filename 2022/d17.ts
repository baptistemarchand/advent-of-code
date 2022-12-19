// https://adventofcode.com/2022/day/17 | Run with `deno run --allow-read d17.ts`

const moves = (await Deno.readTextFile('./input.txt')).split('').map(m => (m === '>' ? 1 : -1))

type Shape = {pattern: string; x: number; y: number; id: number}
const shapes: Shape[] = []

const patterns = ['-', '+', 'n', '|', 'o']
const getRocks = ({pattern, x, y}: Shape) => {
  switch (pattern) {
    case '-':
      return [
        [x + 0, y + 0],
        [x + 1, y + 0],
        [x + 2, y + 0],
        [x + 3, y + 0],
      ]
    case '+':
      return [
        [x + 1, y + 1],
        [x + 0, y + 1],
        [x + 1, y + 0],
        [x + 1, y + 2],
        [x + 2, y + 1],
      ]
    case 'n':
      return [
        [x + 0, y + 0],
        [x + 1, y + 0],
        [x + 2, y + 0],
        [x + 2, y + 1],
        [x + 2, y + 2],
      ]
    case '|':
      return [
        [x + 0, y + 0],
        [x + 0, y + 1],
        [x + 0, y + 2],
        [x + 0, y + 3],
      ]
    case 'o':
      return [
        [x + 0, y + 0],
        [x + 1, y + 0],
        [x + 0, y + 1],
        [x + 1, y + 1],
      ]
  }
  throw Error('No shape')
}

const getHighest = () => Math.max(-1, ...shapes.flatMap(shape => getRocks(shape).map(([_, y]) => y)))

const isValid = (shape: Shape) => {
  const otherShapes = shapes.filter(s => s.id !== shape.id)

  const rocks = getRocks(shape)
  for (const [x, y] of rocks) {
    if (y < 0) {
      return false
    }
    if (x < 0) {
      return false
    }
    if (x >= 7) {
      return false
    }
    for (const otherShape of otherShapes) {
      for (const [ox, oy] of getRocks(otherShape)) {
        if (x === ox && y === oy) {
          return false
        }
      }
    }
  }
  return true
}

let moveId = 0

const moveShape = (shape: Shape) => {
  while (true) {
    const newX = shape.x + moves[moveId % moves.length]

    if (isValid({...shape, x: newX})) {
      shape.x = newX
    }
    moveId++

    if (isValid({...shape, y: shape.y - 1})) {
      shape.y--
    } else {
      return
    }
  }
}

const getTops = () => {
  const tops: number[] = [0, 0, 0, 0, 0, 0, 0]
  for (const shape of shapes) {
    for (const [x, y] of getRocks(shape)) {
      tops[x] = Math.max(tops[x], y)
    }
  }
  const bottom = Math.min(...tops)
  return tops.map(t => t - bottom).join('_')
}

const seen: Record<string, [number, number]> = {}

const TOTAL = 1000000000000
let found = false

for (let i = 0; i < TOTAL; i++) {
  const pattern = patterns[i % 5]
  const highest = getHighest()
  const newShape: Shape = {pattern, x: 2, y: highest + 4, id: i}

  shapes.push(newShape)
  moveShape(newShape)
  const tops = getTops()
  const key = `${moveId % moves.length} / ${tops}`
  if (seen[key] && !found) {
    const shapesLeft = TOTAL - i
    const loopShapeSize = i - seen[key][1]
    const loopsLeft = Math.floor(shapesLeft / loopShapeSize)
    const loopHeight = highest - seen[key][0]

    i = TOTAL - (shapesLeft % loopShapeSize)
    for (const shape of shapes) {
      shape.y += loopsLeft * loopHeight
    }
    found = true
  }
  seen[key] = [highest, i]
}

console.log(getHighest() + 1)
