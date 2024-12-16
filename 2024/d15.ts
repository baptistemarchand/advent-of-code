import chalk from 'jsr:@nothing628/chalk'
import {Point, walkGrid} from '../utils.ts'
import {sumOf} from '@std/collections'

const [map_, moves_] = (await Deno.readTextFile('./input.txt')).split('\n\n')

const map = map_.split('\n').map(line => line.split(''))
const moves = moves_.replaceAll('\n', '').split('')

const boxes: Point[] = []
const robot: Point = {x: 0, y: 0}

walkGrid(map, ({e, x, y}) => {
  if (e === '@') {
    robot.x = x
    robot.y = y
  } else if (e === 'O') {
    boxes.push({x, y})
  }
})

const a: Record<string, Point> = {
  '>': {x: 1, y: 0},
  '^': {x: 0, y: -1},
  '<': {x: -1, y: 0},
  v: {x: 0, y: 1},
}

const print = () => {
  let out = ''
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') {
        out += '#'
      } else if (robot.x === x && robot.y === y) {
        out += chalk.bgRed('@')
      } else if (boxes.some(b => b.x === x && b.y === y)) {
        out += chalk.bgGreen('O')
      } else {
        out += '.'
      }
    }
    out += '\n'
  }
  console.log(out)
}

const moveObject = (p: Point, dir: Point): boolean => {
  const [nx, ny] = [p.x + dir.x, p.y + dir.y]

  if (map[ny][nx] === '#') {
    return false
  }

  const box = boxes.find(b => b.x === nx && b.y === ny)

  if (box) {
    const hasMoved = moveObject(box, dir)
    if (!hasMoved) {
      return false
    }
  }

  p.x = nx
  p.y = ny
  return true
}

for (const move of moves) {
  console.log(`Move ${move}:`)

  const hasMoved = moveObject(robot, a[move])
  if (hasMoved) {
    // print()
  } else {
    // console.log('Invalid move')
  }
}

console.log(sumOf(boxes, box => box.x + box.y * 100))
