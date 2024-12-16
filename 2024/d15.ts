import chalk from 'jsr:@nothing628/chalk'
import {Point, walkGrid} from '../utils.ts'
import {sumOf} from '@std/collections'

const [map_, moves_] = (await Deno.readTextFile('./input.txt')).split('\n\n')
const moves = moves_.replaceAll('\n', '').split('')

type Group = {id?: number; points: Point[]}
const boxes1: Group[] = []
const boxes2: Group[] = []
const robot1: Point = {x: 0, y: 0}
const robot2: Point = {x: 0, y: 0}

const map1 = map_.split('\n').map(line => line.split(''))
const map2: typeof map1 = []
walkGrid(map1, ({e, x, y, p}) => {
  map2[y] ??= []
  if (e === '@') {
    robot1.x = x
    robot1.y = y
    map2[y].push('@', '.')
  } else if (e === '#') {
    map2[y].push('#', '#')
  } else if (e === 'O') {
    map2[y].push('[', ']')
    boxes1.push({points: [p]})
  } else if (e === '.') {
    map2[y].push('.', '.')
  }
})

let id = 0
walkGrid(map2, ({e, x, y}) => {
  if (e === '@') {
    robot2.x = x
    robot2.y = y
  } else if (e === '[') {
    boxes2.push({
      id: id++,
      points: [
        {x, y},
        {x: x + 1, y},
      ],
    })
  }
})

const a: Record<string, Point> = {
  '>': {x: 1, y: 0},
  '^': {x: 0, y: -1},
  '<': {x: -1, y: 0},
  v: {x: 0, y: 1},
}

// const print = () => {
//   let out = ''
//   for (let y = 0; y < map1.length; y++) {
//     for (let x = 0; x < map1[0].length; x++) {
//       if (map1[y][x] === '#') {
//         out += '#'
//       } else if (robot1.x === x && robot1.y === y) {
//         out += chalk.bgRed('@')
//       } else if (boxes1.some(b => b.x === x && b.y === y)) {
//         out += chalk.bgGreen('O')
//       } else {
//         out += '.'
//       }
//     }
//     out += '\n'
//   }
//   console.log(out)
// }

// Returns all the new points that we will touch if we move the object `o` in the direction `dir`
const getNextPoints = (g: Group, dir: Point): Point[] => {
  return g.points.flatMap(p => ({x: p.x + dir.x, y: p.y + dir.y}))

  // // p is a robot or a simple box
  // if (o.x) {
  //   return [{x: o.x + dir.x, y: o.y + dir.y}]
  // }

  // // p is a wide box
  // if (dir.x === 1) {
  //   return [{x: o.x2! + 1, y: o.y}]
  // }
  // if (dir.x === -1) {
  //   return [{x: o.x1! - 1, y: o.y}]
  // }

  // return [
  //   {x: o.x1!, y: o.y + dir.y},
  //   {x: o.x2!, y: o.y + dir.y},
  // ]
}

const canMoveObject = (g: Group, dir: Point, boxes: Group[], map: typeof map1): boolean => {
  const nps = getNextPoints(g, dir)

  if (nps.some(np => map[np.y][np.x] === '#')) {
    return false
  }

  const blockingBoxes = nps
    .map(np => boxes.find(b => b.id !== g.id && b.points.some(p => p.x === np.x && p.y === np.y)))
    .filter(Boolean)

  for (const box of blockingBoxes) {
    if (!canMoveObject(box!, dir, boxes, map)) {
      return false
    }
  }

  return true
}

const moveObject = (g: Group, dir: Point, boxes: Group[]): boolean => {
  const nps = getNextPoints(g, dir)

  const blockingBoxes = nps
    .map(np => boxes.find(b => b.id !== g.id && b.points.some(p => p.x === np.x && p.y === np.y)))
    .filter(Boolean) as Group[]

  const seen = new Set<number>()
  for (const box of blockingBoxes) {
    if (box.id && seen.has(box.id)) {
      continue
    }
    box.id && seen.add(box.id)
    moveObject(box, dir, boxes)
  }

  for (const p of g.points) {
    p.y += dir.y
    p.x += dir.x
  }

  return true
}

for (const move of moves) {
  if (canMoveObject({points: [robot1]}, a[move], boxes1, map1)) {
    moveObject({points: [robot1]}, a[move], boxes1)
  }
  if (canMoveObject({points: [robot2]}, a[move], boxes2, map2)) {
    moveObject({points: [robot2]}, a[move], boxes2)
  }
}

console.log(sumOf(boxes1, box => box.points[0].x! + box.points[0].y * 100))
console.log(sumOf(boxes2, box => box.points[0].x! + box.points[0].y * 100))
