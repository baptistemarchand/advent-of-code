const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

const next: Record<string, [number, number, string]> = {
  UP: [0, -1, 'RIGHT'],
  RIGHT: [1, 0, 'DOWN'],
  DOWN: [0, 1, 'LEFT'],
  LEFT: [-1, 0, 'UP'],
}

const getFirstPos = (): [number, number] => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] === '^') {
        return [j, i]
      }
    }
  }
  throw Error('lol')
}

const [firstX, firstY] = getFirstPos()

const walk = (wall?: {x: number; y: number}) => {
  let [x, y, dir] = [firstX, firstY, 'UP']

  const cache = new Set<string>()
  let length = 0

  while (true) {
    if (cache.has(`${x}-${y}-${dir}`)) {
      return {isLoop: true, length}
    }

    cache.add(`${x}-${y}-${dir}`)

    const xx = x + next[dir][0]
    const yy = y + next[dir][1]

    if (yy >= map.length || yy < 0 || xx >= map[0].length || xx < 0) {
      return {isLoop: false, length}
    }

    if (map[yy][xx] === '#' || (wall?.x === xx && wall?.y === yy)) {
      dir = next[dir][2]
    } else {
      x = xx
      y = yy

      if (map[y][x] !== 'X') {
        length++
      }
      if (!wall) {
        map[y][x] = 'X'
      }
    }
  }
}

const {length: part1} = walk()

let part2 = 0

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === 'X' && walk({x, y}).isLoop) {
      part2++
    }
  }
}

console.log(part1, part2)
