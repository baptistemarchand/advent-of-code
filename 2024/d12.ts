import {sumOf} from '@std/collections'
import {adj4, isInside, Point, walkGrid} from '../utils.ts'

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

type Region = {
  area: number
  perimeter: number
  price: number
  letter: string
  sides: number
  points: Point[]
}
const regions: Region[] = []

const seen = new Set<string>()

const getRegionPoints = (e: string, p: Point, acc: Point[] = []) => {
  if (!isInside({map, p}) || map[p.y][p.x] !== e || seen.has(`${p.x},${p.y}`)) {
    return acc
  }
  seen.add(`${p.x},${p.y}`)

  acc.push(p)

  for (const np of adj4(p)) {
    getRegionPoints(e, np, acc)
  }
  return acc
}

const getPerimeter = (points: Point[], e: string) => {
  let perimeter = 0
  for (const p of points) {
    for (const np of adj4(p)) {
      if (map[np.y]?.[np.x] !== e) {
        perimeter++
      }
    }
  }
  return perimeter
}

walkGrid(map, ({e, x, y, p}) => {
  if (seen.has(`${x},${y}`)) {
    return
  }

  const points = getRegionPoints(e, p)
  const perimeter = getPerimeter(points, e)
  regions.push({
    letter: e,
    points,
    area: points.length,
    perimeter,
    price: points.length * perimeter,
    sides: 0,
  })
})

console.log(sumOf(regions, r => r.price))

for (const region of regions) {
  const aa = ({x: dx, y: dy}: Point, next: Point) => {
    let walls = 0

    const seen = new Set<string>()

    for (const {x, y} of region.points) {
      if (seen.has(`${x},${y}`)) {
        continue
      }
      seen.add(`${x},${y}`)

      if (map[y + dy]?.[x + dx] === region.letter) {
        continue
      }

      walls++

      for (
        let i = 0;
        map[y + next.y * i]?.[x + next.x * i] === region.letter &&
        map[y + dy + next.y * i]?.[x + dx + next.x * i] !== region.letter;
        i++
      ) {
        seen.add(`${x + i * next.x},${y + i * next.y}`)
      }

      for (
        let i = 0;
        map[y + next.y * i]?.[x + next.x * i] === region.letter &&
        map[y + dy + next.y * i]?.[x + dx + next.x * i] !== region.letter;
        i--
      ) {
        seen.add(`${x + i * next.x},${y + i * next.y}`)
      }
    }

    return walls
  }

  region.sides =
    aa({x: 0, y: -1}, {x: 1, y: 0}) +
    aa({x: 0, y: 1}, {x: 1, y: 0}) +
    aa({x: 1, y: 0}, {x: 0, y: 1}) +
    aa({x: -1, y: 0}, {x: 0, y: 1})
}

console.log(sumOf(regions, r => r.sides * r.area))
