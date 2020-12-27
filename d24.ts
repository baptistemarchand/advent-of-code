// https://adventofcode.com/2020/day/24 | Run with `deno run --allow-read d24.ts`

const getCoords = (line: string): string => {
  let n = 0
  let e = 0

  for (let i = 0; i < line.length; i++) {
    switch (line[i]) {
      case 'e':
        e++
        break
      case 'w':
        e--
        break
      case 'n':
        n++
        e += line[++i] === 'e' ? 0.5 : -0.5
        break
      case 's':
        n--
        e += line[++i] === 'e' ? 0.5 : -0.5
        break
    }
  }

  return n + ' ' + e
}

type Tiles = Record<string, boolean>
let map: Tiles = {} // true == black

for (const line of (await Deno.readTextFile('input.txt')).split('\n')) {
  const coords = getCoords(line)
  map[coords] = !map[coords]
}

const countBlackTiles = (tiles: Tiles) => Object.values(tiles).filter(x => x).length

console.log(countBlackTiles(map))

// ---- part 2 ----

const getNeighbours = (coord: string): string[] => {
  const [n, e] = coord.split(' ').map(Number)
  return [
    [n, e - 1],
    [n, e + 1],
    [n + 1, e + 0.5],
    [n + 1, e - 0.5],
    [n - 1, e + 0.5],
    [n - 1, e - 0.5],
  ].map(([a, b]) => a + ' ' + b)
}

const getAllCoords = (tiles: Tiles): Set<string> => {
  const result = new Set(Object.keys(tiles))
  for (const coord in tiles) {
    getNeighbours(coord).forEach(neighbour => result.add(neighbour))
  }
  return result
}

const updateTiles = (tiles: Tiles) => {
  const newTiles = {...tiles}
  for (const coord of getAllCoords(tiles)) {
    const blackAdjacents = getNeighbours(coord).filter(n => tiles[n]).length
    if (tiles[coord]) {
      // black
      if (blackAdjacents === 0 || blackAdjacents > 2) {
        newTiles[coord] = false
      }
    } else {
      // white
      if (blackAdjacents === 2) {
        newTiles[coord] = true
      }
    }
  }
  return newTiles
}

for (let i = 0; i < 100; i++) {
  map = updateTiles(map)
}
console.log(countBlackTiles(map))

export {} // To prevent isolatedModules error
