// https://adventofcode.com/2023/day/6 | Run with `deno run --allow-read d06.ts`

import {getNumbers, mul} from '../utils.ts'

type Race = {time: number; distance: number}

const parse = async (): Promise<Race[]> => {
  const [timeLine, distanceLine] = (await Deno.readTextFile('./input.txt')).split('\n')
  const times = getNumbers(timeLine)
  const distances = getNumbers(distanceLine)

  const races = []
  for (const [i, time] of times.entries()) {
    races.push({time, distance: distances[i]})
  }
  return races
}

const races = await parse()

const getN = (race: Race): number => {
  let n = 0
  for (let speed = 1; speed < race.time; speed++) {
    const distance = speed * (race.time - speed)
    if (distance > race.distance) {
      n++
    }
  }
  return n
}

// part 1
console.log(races.map(getN).reduce(mul))

// part 2
console.log(
  getN({
    time: 54946592,
    distance: 302147610291404,
  }),
)
