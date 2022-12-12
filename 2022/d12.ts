// https://adventofcode.com/2022/day/12 | Run with `deno run --allow-read d12.ts`

const map = (await Deno.readTextFile('./input.txt')).split('\n').map(line => line.split(''))

type Tile = {col: number; row: number; score: number}

const start: Tile = {col: 0, row: 0, score: 0}
const end: Tile = {col: 0, row: 0, score: 0}

for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    const h = map[row][col]
    if (h === 'S') {
      start.col = col
      start.row = row
      map[row][col] = 'a'
    }
    if (h === 'E') {
      end.col = col
      end.row = row
      map[row][col] = 'z'
    }
  }
}

const tilesToProcess: Tile[] = [end]
const seenTiles = new Set<string>()

const canGo = (from_: string | null, to_: string) => {
  if (!from_) {
    return false
  }

  const getHeight = (letter: string) => 'abcdefghijklmnopqrstuvwxyz'.indexOf(letter)

  const from = getHeight(from_)
  const to = getHeight(to_)

  return to <= from || to === from + 1
}

const processTile = ({row, col, score}: Tile) => {
  if (seenTiles.has(`${row}.${col}`)) {
    return
  }
  seenTiles.add(`${row}.${col}`)

  // For part 2
  if (map[row][col] === 'a') {
    console.log('Found shortest path from any "a": ', score)
    Deno.exit()
  }

  // For part 1
  if (row === start.row && col === start.col) {
    console.log('Found shortest path from start:', score)
    Deno.exit()
  }

  for (const [newRow, newCol] of [
    [row - 1, col], // North
    [row + 1, col], // South
    [row, col - 1], // West
    [row, col + 1], // East
  ]) {
    if (newCol < 0 || newRow < 0 || newRow >= map.length || newCol >= map[0].length) {
      continue
    }

    if (canGo(map[newRow][newCol], map[row][col])) {
      tilesToProcess.push({row: newRow, col: newCol, score: score + 1})
    }
  }
}

while (tilesToProcess.length) {
  processTile(tilesToProcess.shift()!)
}
