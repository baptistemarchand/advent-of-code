import {minBy} from '@std/collections'
import {walkGrid} from '../utils.ts'
import {findPosInGrid, Point as Point_, printGrid} from '../utils.ts'

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

const start = {...findPosInGrid(map, 'S'), dir: 'E'}
const ends = ['N', 'S', 'E', 'W'].map(dir => ({...findPosInGrid(map, 'E'), dir}))

type Point = Point_ & {dir: string}
let q: Point[] = []
const data: Record<string, {dist: number; prevs: Point[]}> = {}

walkGrid(map, ({e, x, y, p}) => {
  if (e !== '#') {
    for (const dir of ['N', 'S', 'E', 'W']) {
      data[`${x},${y},${dir}`] = {dist: Infinity, prevs: []}
      q.push({...p, dir})
    }
  }
})

data[`${start.x},${start.y},${start.dir}`].dist = 0

while (q.length) {
  const u = minBy(q, ({x, y, dir}) => data[`${x},${y},${dir}`].dist)
  if (!u) {
    throw Error('lol')
  }
  if (ends.some(end => u.x === end.x && u.y === end.y)) {
    break
  }

  q = q.filter(p => p.x !== u.x || p.y !== u.y || p.dir !== u.dir)

  const vs = []
  if (u.dir === 'N') {
    vs.push({...u, dir: 'E', cost: 1000})
    vs.push({...u, dir: 'W', cost: 1000})
    vs.push({...u, y: u.y - 1, cost: 1})
  } else if (u.dir === 'S') {
    vs.push({...u, dir: 'E', cost: 1000})
    vs.push({...u, dir: 'W', cost: 1000})
    vs.push({...u, y: u.y + 1, cost: 1})
  } else if (u.dir === 'E') {
    vs.push({...u, dir: 'S', cost: 1000})
    vs.push({...u, dir: 'N', cost: 1000})
    vs.push({...u, x: u.x + 1, cost: 1})
  } else if (u.dir === 'W') {
    vs.push({...u, dir: 'S', cost: 1000})
    vs.push({...u, dir: 'N', cost: 1000})
    vs.push({...u, x: u.x - 1, cost: 1})
  }

  for (const {cost, ...v} of vs) {
    if (!q.some(p => p.x === v.x && p.y === v.y && p.dir === v.dir)) {
      continue
    }

    const alt = data[`${u.x},${u.y},${u.dir}`].dist + cost
    if (alt < data[`${v.x},${v.y},${v.dir}`].dist) {
      data[`${v.x},${v.y},${v.dir}`].dist = alt
      data[`${v.x},${v.y},${v.dir}`].prevs = [u]
    } else if (alt === data[`${v.x},${v.y},${v.dir}`].dist) {
      data[`${v.x},${v.y},${v.dir}`].prevs.push(u)
    }
  }
}

const markPath = ({x, y, dir}: Point) => {
  map[y][x] = 'O'
  for (const prev of data[`${x},${y},${dir}`].prevs) {
    markPath(prev)
  }
}

for (const end of ends) {
  markPath(end)
}

printGrid(map, e => ({c: e, bg: e === 'O' ? '#ff0000' : ''}))

let part2 = 0
walkGrid(map, ({e}) => (part2 += e === 'O' ? 1 : 0))
console.log(part2)
