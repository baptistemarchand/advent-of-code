import {minBy} from '@std/collections/min-by'
import {adj4, findPosInGrid, Point, walkGrid} from '../utils.ts'

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

const start = findPosInGrid(map, 'S')
const end = findPosInGrid(map, 'E')

const solve = (cheat?: Point) => {
  let q: Point[] = []
  const data: Record<string, number> = {}

  walkGrid(map, ({e, x, y}) => {
    if (e !== '#' || (cheat?.x === x && cheat?.y === y)) {
      data[`${x},${y}`] = Infinity
    }
  })

  data[`${start.x},${start.y}`] = 0
  q.push(start)

  while (q.length) {
    const u = minBy(q, p => (p ? data[`${p.x},${p.y}`] : Infinity))
    if (!u) {
      throw Error('lol')
    }

    if (u.x === end.x && u.y === end.y) {
      break
    }

    q = q.filter(p => p.x !== u.x || p.y !== u.y)

    for (const v of adj4(u)) {
      if (map[v.y][v.x] === '#' && !(cheat?.x === v.x && cheat?.y === v.y)) {
        continue
      }

      const alt = data[`${u.x},${u.y}`] + 1

      if (alt < data[`${v.x},${v.y}`]) {
        data[`${v.x},${v.y}`] = alt
        q.push(v)
      }
    }
  }

  return data[`${end.x},${end.y}`]
}

const base = solve()

let part1 = 0

walkGrid(map, ({e, p, x, y}) => {
  if (e !== '#' || x == 0 || y === 0 || x === map[0].length - 1 || y === map.length - 1) {
    return
  }

  const diff = base - solve(p)
  if (diff >= 100) {
    part1++
  }
})

console.log(part1)
