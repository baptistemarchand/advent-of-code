import {sumOf} from '@std/collections'
import {walkGrid, isInside, adj4, Point} from '../utils.ts'

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split('').map(Number))

const zeros: Point[] = [] // Point = {x: number; y: number}
const nines: Point[] = []

walkGrid(map, ({e, p}) => {
  if (e === 0) {
    zeros.push(p)
  }
  if (e === 9) {
    nines.push(p)
  }
})

// Can we reach point Z, starting from P ?
const canReach = (p: Point, z: Point): boolean => {
  if (p.x === z.x && p.y === z.y) {
    return true
  }

  return adj4(p).some(np => {
    if (map[np.y]?.[np.x] === map[p.y][p.x] - 1) {
      return canReach(np, z)
    }
    return false
  })
}

const getScore = (zero: Point) => nines.filter(nine => canReach(nine, zero)).length
const part1 = sumOf(zeros, z => getScore(z))

const getRating = (z: Point) => {
  const paths = new Set<string>()

  const explore = (p: Point, path = '') => {
    if (!isInside({map, p})) {
      return
    }

    if (map[p.y][p.x] === 9) {
      paths.add(path)
      return
    }

    for (const np of adj4(p)) {
      if (map[np.y]?.[np.x] === map[p.y][p.x] + 1) {
        explore(np, path + `(${np.x},${np.y})`)
      }
    }
  }

  explore(z) // Explore the map starting from a zero point
  return paths.size
}

const part2 = sumOf(zeros, z => getRating(z))
console.log(part1, part2)
