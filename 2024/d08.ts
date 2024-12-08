import {isInside, walkGrid} from '../utils.ts'
const map = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

const antennasByFreq: Record<string, [number, number][]> = {}
walkGrid(map, ({e, x, y}) => e !== '.' && (antennasByFreq[e] ??= []).push([x, y]))

const [nodes1, nodes2] = [new Set(), new Set()]

const addNode1 = (x: number, y: number) => isInside({map, x, y}) && nodes1.add(`${x}-${y}`)

for (const antennas of Object.values(antennasByFreq)) {
  for (const [x1, y1] of antennas) {
    for (const [x2, y2] of antennas) {
      if (x1 !== x2 || y1 !== y2) {
        const [dx, dy] = [x2 - x1, y2 - y1]
        addNode1(x2 + dx, y2 + dy)
        for (let [x, y] = [x2, y2]; isInside({map, x, y}); [x, y] = [x + dx, y + dy]) {
          nodes2.add(`${x}-${y}`)
        }
      }
    }
  }
}

console.log(nodes1.size, nodes2.size)
