// https://adventofcode.com/2022/day/5 | Run with `deno run --allow-read d5.ts`

const [drawing, instructions] = (await Deno.readTextFile('./input.txt')).split('\n\n')

const stacks: Record<string, string[]> = {}

const layers = drawing.split('\n')
let height = 7
for (const layer of layers) {
  const chars = layer.split('')
  let stackId = 1
  for (let i = 1; i < chars.length; i += 4) {
    if (!stacks[stackId]) {
      stacks[stackId] = []
    }
    if (chars[i] !== ' ') {
      stacks[stackId][height] = chars[i]
    }
    stackId++
  }
  height--
}

for (const instruction of instructions.split('\n')) {
  const [_, quantity_, from, to] = instruction.match(/move (\d+) from (\d) to (\d)/)!
  const quantity = parseInt(quantity_)

  // For part 1 :
  // for (let i = 0; i < quantity; i++) {
  //   const crate = stacks[from].pop()!
  //   stacks[to].push(crate)
  // }

  const cratesToMove = stacks[from].slice(-quantity)
  stacks[from] = stacks[from].slice(0, stacks[from].length - quantity)
  stacks[to].push(...cratesToMove)
}

console.log(
  Object.values(stacks)
    .map(stack => stack.at(-1))
    .join(''),
)
