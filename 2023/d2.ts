// https://adventofcode.com/2023/day/2 | Run with `deno run --allow-read d2.ts`

import {sum} from '../utils.ts'

type Set = {
  red: number
  green: number
  blue: number
}

type Game = {
  id: number
  sets: Set[]
}

const parseLine = (line: string): Game => {
  const [gameId, rest] = line.split(': ')
  const sets = rest.split('; ').map(rawSet => {
    const set: Set = {
      red: 0,
      green: 0,
      blue: 0,
    }
    rawSet.split(', ').forEach(subset => {
      const [n, color] = subset.split(' ')
      set[color as keyof Set] += parseInt(n)
    })
    return set
  })
  return {
    id: parseInt(gameId.split(' ')[1]),
    sets,
  }
}

const result = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(parseLine)
  // .filter(game => game.sets.every(set => set.red <= 12 && set.green <= 13 && set.blue <= 14))
  // .map(game => game.id)
  .map(game => {
    const min: Set = {
      red: 0,
      green: 0,
      blue: 0,
    }
    for (const set of game.sets) {
      for (const color of ['red', 'green', 'blue'] as const) {
        if (set[color] > min[color]) {
          min[color] = set[color]
        }
      }
    }
    return min.red * min.green * min.blue
  })
  .reduce(sum)

console.log(result)
