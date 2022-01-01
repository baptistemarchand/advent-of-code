// https://adventofcode.com/2020/day/12 | Run with `deno run --allow-read d12.ts`

// In javascript, -1 % 4 === -1, on Google -1 % 4 === 3
// This function re-creates Google's behaviour
const mod = (a: number, b: number) => ((a % b) + b) % b

let lines = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean)
const actions = lines.map((line): [string, number] => [line[0], Number(line.slice(1))])

const solve1 = () => {
  const ship = {x: 0, y: 0, angle: 0}

  const go: Record<string, (n: number) => void> = {
    N: n => (ship.y += n),
    S: n => (ship.y -= n),
    E: n => (ship.x += n),
    W: n => (ship.x -= n),
    L: n => (ship.angle -= n),
    R: n => (ship.angle += n),
    F: n => go[['E', 'S', 'W', 'N'][Math.abs(mod(ship.angle / 90, 4))]](n),
  }

  actions.forEach(([command, n]) => go[command](n))
  console.log(Math.abs(ship.x) + Math.abs(ship.y))
}

const solve2 = () => {
  const ship = {x: 0, y: 0}
  let wp = {x: 10, y: 1}

  const go: Record<string, (n: number) => void> = {
    N: n => (wp.y += n),
    S: n => (wp.y -= n),
    E: n => (wp.x += n),
    W: n => (wp.x -= n),
    L: n => {
      for (let i = 0; i++ < n / 90; wp = {x: -wp.y, y: wp.x}) {}
    },
    R: n => {
      for (let i = 0; i++ < n / 90; wp = {x: wp.y, y: -wp.x}) {}
    },
    F: n => {
      ship.x += wp.x * n
      ship.y += wp.y * n
    },
  }

  actions.forEach(([command, n]) => go[command](n))
  console.log(Math.abs(ship.x) + Math.abs(ship.y))
}

solve1()
solve2()

export {} // To prevent isolatedModules error
