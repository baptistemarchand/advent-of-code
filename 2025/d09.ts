import {Grid, getInput, max, min, Point, rectangleArea} from '../utils.ts'

let [part1, part2] = [0, 0]

const points = (await getInput('d09', 'example')).split('\n').map(line => {
  const [x, y] = line.split(',').map(Number)
  return new Point(x, y)
})

// console.log(points)

for (const p1 of points) {
  for (const p2 of points) {
    const area = rectangleArea(p1, p2)
    if (area > part1) {
      part1 = area
    }
  }
}

const maxX = max(...points.map(p => p.x))
const maxY = max(...points.map(p => p.y))

const g = Grid.createFromDimensions(maxX + 3, maxY + 2, '.')
for (let i = -1; i < points.length - 1; i++) {
  if (points.at(i)!.y === points.at(i + 1)!.y) {
    for (let x = min(points.at(i)!.x, points.at(i + 1)!.x); x <= max(points.at(i)!.x, points.at(i + 1)!.x); x++) {
      g.set(new Point(x, points.at(i)!.y), '#')
    }
  } else {
    for (let y = min(points.at(i)!.y, points.at(i + 1)!.y); y <= max(points.at(i)!.y, points.at(i + 1)!.y); y++) {
      g.set(new Point(points.at(i)!.x, y), '#')
    }
  }
}
// g.walk(({p}) => {
//   if (points.some(point => point.equals(p))) {
//     g.set(p, '#')
//   }
// })
// let inWall = false
// g.walkVertically(({p, e}) => {
//   if (e === '#') {
//     inWall = !inWall
//   }

//   if (inWall && e !== '#') {
//     g.set(p, '#')
//   }
// })
// inWall = false
// g.walk(({p, e}) => {
//   if (e === '#') {
//     inWall = !inWall
//   }

//   if (inWall && e !== '#') {
//     g.set(p, '#')
//   }
// })

g.print()

console.log(part1, part2)

// validate('2025/d09', part1, 4745816424, part2, 27055852018812)
