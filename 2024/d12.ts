import {adj4, isInside, Point, walkGrid} from '../utils.ts'

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

const seen = new Set<string>()

const getRegionPoints = (e: string, p: Point, acc: Point[] = []) => {
  if (seen.has(`${p.x},${p.y}`) || !isInside({map, p}) || map[p.y][p.x] !== e) {
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

const getSides = (points: Point[], e: string) => {
  const countSides = ({x: dx, y: dy}: Point, next: Point) => {
    let walls = 0

    const seen = new Set<string>()

    for (const {x, y} of points) {
      if (seen.has(`${x},${y}`)) {
        continue
      }
      seen.add(`${x},${y}`)

      if (map[y + dy]?.[x + dx] === e) {
        continue
      }

      walls++

      // SORRY
      for (
        let i = 0;
        map[y + next.y * i]?.[x + next.x * i] === e && map[y + dy + next.y * i]?.[x + dx + next.x * i] !== e;
        i++
      ) {
        seen.add(`${x + i * next.x},${y + i * next.y}`)
      }

      for (
        let i = 0;
        map[y + next.y * i]?.[x + next.x * i] === e && map[y + dy + next.y * i]?.[x + dx + next.x * i] !== e;
        i--
      ) {
        seen.add(`${x + i * next.x},${y + i * next.y}`)
      }
    }

    return walls
  }

  return (
    countSides({x: 0, y: -1}, {x: 1, y: 0}) +
    countSides({x: 0, y: 1}, {x: 1, y: 0}) +
    countSides({x: 1, y: 0}, {x: 0, y: 1}) +
    countSides({x: -1, y: 0}, {x: 0, y: 1})
  )
}

let [part1, part2] = [0, 0]

walkGrid(map, ({e, p}) => {
  const points = getRegionPoints(e, p)
  console.log(points)

  part1 += points.length * getPerimeter(points, e)
  part2 += points.length * getSides(points, e)
})

console.log(part1, part2)
