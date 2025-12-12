import {distinctBy, partition, sortBy} from '@std/collections'
import {asc, distance3d, getInput, mul, Point3d, validate} from '../utils.ts'

const points = (await getInput('d08', 'full')).split('\n').map(line => {
  const [x, y, z] = line.split(',').map(Number)
  return new Point3d(x, y, z)
})

let links: {p1: Point3d; p2: Point3d; d: number}[] = []

const cache: Record<string, true> = {}

for (const p1 of points) {
  for (const p2 of points) {
    if (p1.equals(p2) || cache[`${p1} ${p2}`]) {
      continue
    }
    links.push({
      p1,
      p2,
      d: distance3d(p1, p2),
    })
    cache[`${p1} ${p2}`] = cache[`${p2} ${p1}`] = true
  }
}

links = sortBy(links, link => link.d)

let circuits: {
  points: Point3d[]
}[] = []

let [part1, part2, numberOfConnections] = [0, 0, 0]

for (const {p1, p2} of links) {
  if (!part1 && ++numberOfConnections > 1000) {
    part1 = circuits
      .map(c => c.points.length)
      .toSorted(asc)
      .slice(-3)
      .reduce(mul)
  }

  const [matchingCircuits, otherCircuits] = partition(circuits, c => c.points.some(p => p.equals(p1) || p.equals(p2)))
  circuits = [
    ...otherCircuits,
    {
      points: distinctBy([...matchingCircuits.flatMap(c => c.points), p1, p2], p => p.toString()),
    },
  ]

  if (circuits[0].points.length === points.length) {
    part2 = p1.x * p2.x
    break
  }
}

validate('2025/d08', part1, 69192, part2, 7264308110)
