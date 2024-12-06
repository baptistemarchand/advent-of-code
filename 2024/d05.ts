import {getNumbers} from '../utils.ts'

const [rules, updates] = (await Deno.readTextFile('./input.txt')).split('\n\n').map(x => x.split('\n').map(getNumbers))
let [part1, part2] = [0, 0]

for (const update of updates) {
  const sorted = update.slice().sort((a, b) => {
    if (rules.find(rule => rule[0] === a && rule[1] === b)) {
      return -1
    }
    if (rules.find(rule => rule[0] === b && rule[1] === a)) {
      return 1
    }
    return 0
  })

  if (sorted.join() === update.join()) {
    part1 += update[Math.floor(update.length / 2)]
  } else {
    part2 += sorted[Math.floor(update.length / 2)]
  }
}

console.log(part1, part2)
