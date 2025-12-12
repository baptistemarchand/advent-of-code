import {distinctBy} from '@std/collections'
import {getInput, sum} from '../utils.ts'

type Machine = {
  goal: number
  ns: number[]
}

const machines: Machine[] = (await getInput('d10', 'full')).split('\n').map(line => {
  const goal = line
    .match(/\[[.#]+\]/g)?.[0]
    ?.slice(1, -1)
    .split('')
    .map(x => (x === '#' ? 1 : 0))
    .reverse()
    .join('')!

  const ns = [...line.matchAll(/\([\d,]+\)/g)].map(m =>
    m[0]
      .slice(1, -1)
      .split(',')
      .map(s => 2 ** +s)
      .reduce(sum),
  )

  return {
    goal: parseInt(goal, 2),
    ns,
  }
})
// .filter(m => m.label === '[...#...#.#]')

const handleMachine = (machine: Machine): number => {
  let todo: {n: number; depth: number}[] = [{n: 0, depth: 0}]

  while (todo.length) {
    const x = todo.shift()!

    if (x.n === machine.goal) {
      return x.depth
    }

    for (const n of machine.ns) {
      todo.push({n: x.n ^ n, depth: x.depth + 1})
      todo = distinctBy(todo, t => `${t.n} ${t.depth}`)
    }
  }
}

const part1 = machines.map(handleMachine).reduce(sum)

console.log(part1)

// validate('2025/d10', part1, 550, part2, 7264308110)
