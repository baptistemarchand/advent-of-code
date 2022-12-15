// https://adventofcode.com/2022/day/15 | Run with `deno run --allow-read d15.ts`

const pairs = (await Deno.readTextFile('./input.txt')).split('\n').map(line => {
  const [_, sx, sy, bx, by] = line
    .match(/Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/)!
    .map(Number)
  return {
    sensor: {y: sy, x: sx},
    beacon: {y: by, x: bx},
    distance: Math.abs(sy - by) + Math.abs(sx - bx),
  }
})

const getRanges = (y: number) =>
  pairs
    .map(({sensor, distance}) => {
      const dy = Math.abs(sensor.y - y)
      const dx = distance - dy
      return [sensor.x - dx, sensor.x + dx]
    })
    .filter(([x1, x2]) => x1 < x2)

const ranges = getRanges(2_000_000)
const x1 = Math.min(...ranges.map(r => r[0]))
const x2 = Math.max(...ranges.map(r => r[1]))
// Part 1
console.log(x2 - x1)

const getBeaconX = (y: number) => {
  let ranges = getRanges(y)

  let xMin = 0

  while (ranges.length) {
    const r = ranges.find(([x1]) => x1 <= xMin + 1)
    if (!r) {
      return xMin + 1
    }
    xMin = Math.max(r[1], xMin)
    ranges = ranges.filter(x => x[0] !== r[0] || x[1] !== r[1])
  }
  return null
}

for (let y = 0; y < 4_000_000; y++) {
  const x = getBeaconX(y)
  if (x) {
    console.log(y + x * 4_000_000)
    Deno.exit()
  }
}
