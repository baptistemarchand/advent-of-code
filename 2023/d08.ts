// https://adventofcode.com/2023/day/8 | Run with `deno run --allow-read d08.ts`

import {leastCommonMultiple} from '../utils.ts'

const parse = async () => {
  const [directions, graphLines] = (await Deno.readTextFile('./input.txt')).split('\n\n')
  return {
    directions: directions.split('') as ('L' | 'R')[],
    nodes: Object.fromEntries(
      graphLines.split('\n').map(line => {
        const [_, label, L, R] = line.match(/(\w+) = \((\w+), (\w+)\)/)!
        return [label, {label, L, R}]
      }),
    ),
  }
}

const {directions, nodes} = await parse()

const getNextLabel = (currentLabel: string, i: number) => {
  const currentNode = nodes[currentLabel]

  const direction: 'L' | 'R' = directions[i % directions.length]
  return currentNode[direction]
}

const getStepCount = (startLabel: string, isEndNode: (label: string) => boolean) => {
  let label = startLabel
  let i = 0
  while (true) {
    if (isEndNode(label)) {
      return i
    }
    label = getNextLabel(label, i)
    i++
  }
}

// part 1
console.log(getStepCount('AAA', l => l === 'ZZZ'))

// part 2
const startLabels = Object.keys(nodes).filter(label => label.at(-1) === 'A')

// Disclaimer : I don't know why this works
const stepCounts = startLabels.map(label => getStepCount(label, l => l.at(-1) === 'Z'))

console.log(leastCommonMultiple(stepCounts))
