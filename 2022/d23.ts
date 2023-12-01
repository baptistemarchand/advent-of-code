// https://adventofcode.com/2022/day/23 | Run with `deno run --allow-read d23.ts`

const grid = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

type Pos = {x: number; y: number}
type Elf = {pos: Pos; next: Pos | null}
const elves: Elf[] = []

const sides = {
  N: ['NE', 'N', 'NW'],
  S: ['SE', 'S', 'SW'],
  E: ['NE', 'E', 'SE'],
  W: ['NW', 'W', 'SW'],
} as const

const getSurroundings = ({x, y}: Pos) => ({
  N: {x, y: y - 1},
  S: {x, y: y + 1},
  E: {x: x + 1, y},
  W: {x: x - 1, y},
  NE: {x: x + 1, y: y - 1},
  NW: {x: x - 1, y: y - 1},
  SE: {x: x + 1, y: y + 1},
  SW: {x: x - 1, y: y + 1},
})

const getCardinal = (pos: Pos) => {
  const {N, S, E, W} = getSurroundings(pos)
  return [N, S, E, W]
}

// const surroundings = (pos: Pos): Pos[] => [
//   ...cardinals(pos), //
//   ...diagonals(pos),
// ]

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === '#') {
      elves.push({pos: {x, y}, next: null})
    }
  }
}

const isEmpty2 = ({x, y}: Pos) => !elves.some(e => e.pos.x === x && e.pos.y === y)

const print = () => {
  const minY = Math.min(...elves.map(e => e.pos.y))
  const minX = Math.min(...elves.map(e => e.pos.x))
  const maxY = Math.max(...elves.map(e => e.pos.y))
  const maxX = Math.max(...elves.map(e => e.pos.x))
  let out = ''
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      out += isEmpty2({x, y}) ? '.' : '#'
    }
    out += '\n'
  }
  console.log(out)

  console.log()
}

const isEmpty = (pos: Pos, bla: Set<string>): boolean => {
  const key = `${pos.x}.${pos.y}`
  return !bla.has(key)
}

const cardinals = ['N', 'S', 'W', 'E'] as const

const getSide = (surroundings: Record<string, Pos>, side: 'N' | 'S' | 'E' | 'W') =>
  sides[side].map(d => surroundings[d])

const getNextPos = (round: number, surroundings: any, bla: Set<string>): Pos | null => {
  for (let i = 0; i < 4; i++) {
    const cardinal = cardinals[(round + i) % 4]
    // console.log('checking', cardinal, getSide(surroundings, cardinal))

    if (getSide(surroundings, cardinal).every(x => isEmpty(x, bla))) {
      return surroundings[cardinal]
    }
  }

  return null
}

const round = (roundNb: Readonly<number>) => {
  // print()
  const bla = new Set<string>()
  for (const elf of elves) {
    const key = `${elf.pos.x}.${elf.pos.y}`
    bla.add(key)
  }
  // console.log(bla)

  let moved = false
  const elfCountAtPos: Record<string, number> = {}
  // step 1
  console.time('step 1')
  for (const elf of elves) {
    // console.log('Processing elf', elf)

    const surroundings = getSurroundings(elf.pos)
    const alone = Object.values(surroundings).every(x => isEmpty(x, bla))
    if (alone) {
      continue
    }

    elf.next = getNextPos(roundNb, surroundings, bla)
    if (elf.next) {
      const key = `${elf.next.x}.${elf.next.y}`
      if (!elfCountAtPos[key]) {
        elfCountAtPos[key] = 0
      }
      elfCountAtPos[key]++
    }
  }

  console.timeEnd('step 1')
  // step 2
  for (const elf of elves) {
    if (!elf.next) {
      continue
    }
    const key = `${elf.next.x}.${elf.next.y}`
    if (elfCountAtPos[key] === 1) {
      bla.delete(key)
      elf.pos = {...elf.next}
      moved = true
    }
    elf.next = null
  }
  // print()

  return moved
}

// print()
for (let r = 0; ; r++) {
  // console.log('round', r)

  const moved = round(r)
  if (!moved) {
    console.log(r + 1)
    break
  }
}

// const minY = Math.min(...elves.map(e => e.pos.y))
// const minX = Math.min(...elves.map(e => e.pos.x))
// const maxY = Math.max(...elves.map(e => e.pos.y))
// const maxX = Math.max(...elves.map(e => e.pos.x))
// let total = 0
// for (let y = minY; y <= maxY; y++) {
//   for (let x = minX; x <= maxX; x++) {
//     if (isEmpty({x, y})) {
//       total++
//     }
//   }
// }
// console.log(total)
