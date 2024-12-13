import {getNumbers, Point, solveTwoEquations} from '../utils.ts'

type Machine = {a: Point; b: Point; prize: Point}

const machines: Machine[] = (await Deno.readTextFile('./input.txt')).split('\n\n').map(m => {
  const [a, b, prize] = m.split('\n').map(getNumbers)
  return {
    a: {x: a[0], y: a[1]},
    b: {x: b[0], y: b[1]},
    prize: {x: prize[0], y: prize[1]},
  }
})

const getTokens = ({prize, a, b}: Machine) => {
  const res = solveTwoEquations(
    // We want to find the A and B pair that resolves the equations :
    {a: a.x, b: b.x, r: prize.x}, // Eqation for X : (a.x * A) + (b.x * B) = prize.x
    {a: a.y, b: b.y, r: prize.y}, // Eqation for Y : (a.y * A) + (b.y * B) = prize.y
  )

  if (!res || res.x % 1 !== 0 || res.y % 1 !== 0) {
    return 0
  }

  return res.x * 3 + res.y
}

let [part1, part2] = [0, 0]

for (const machine of machines) {
  part1 += getTokens(machine)
  machine.prize.x += 10000000000000
  machine.prize.y += 10000000000000
  part2 += getTokens(machine)
}

console.log(part1, part2)
