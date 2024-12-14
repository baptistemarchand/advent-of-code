import {getNumbers, modulo, mul, point, Point, range, max} from '../utils.ts'

const [WIDTH, HEIGHT] = [101, 103]
const [MID_X, MID_Y] = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)]

type Robot = {p: Point; v: Point; quadrant?: 0 | 1 | 2 | 3}

const robots: Robot[] = (await Deno.readTextFile('./input.txt')).split('\n').map(line => {
  const [px, py, vx, vy] = getNumbers(line)
  return {
    p: point(px, py),
    v: point(vx, vy),
  }
})

// prettier-ignore
const getQuadrant = ({x, y}: Point): Robot['quadrant'] => {
  if (x < MID_X && y < MID_Y) {return 0}
  if (x > MID_X && y < MID_Y) {return 1}
  if (x < MID_X && y > MID_Y) {return 2}
  if (x > MID_X && y > MID_Y) {return 3}
}

for (let i = 1; ; i++) {
  for (const robot of robots) {
    robot.p.x = modulo(robot.p.x + robot.v.x, WIDTH)
    robot.p.y = modulo(robot.p.y + robot.v.y, HEIGHT)
    robot.quadrant = getQuadrant(robot.p)
  }

  const robotCountPerQuadrant = range(4).map(q => robots.filter(r => r.quadrant === q).length)

  if (i === 100) {
    console.log(robotCountPerQuadrant.reduce(mul)) // part 1
  }

  if (max(...robotCountPerQuadrant) > robots.length / 2) {
    console.log(i) // part 2 (Most robots are in one quadrant)
    break
  }
}
