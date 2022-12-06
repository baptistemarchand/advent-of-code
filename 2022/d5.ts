// https://adventofcode.com/2022/day/5 | Run with `deno run --allow-read d5.ts`

const [drawing, instructions] = (await Deno.readTextFile('./input.txt')).split('\n\n')

const MAX_HEIGHT = 7

const stacks: Record<string, string[]> = {}
for (let stackId = 1; stackId <= 9; stackId++) {
  stacks[stackId] = []
  for (let height = 0; height <= MAX_HEIGHT; height++) {
    const crate = drawing.charAt(36 * (MAX_HEIGHT - height) + 1 + (stackId - 1) * 4)
    if (crate !== ' ') {
      stacks[stackId][height] = crate
    }
  }
}

for (const instruction of instructions.split('\n')) {
  const [_, quantity, from, to] = instruction.match(/move (\d+) from (\d) to (\d)/)!

  // For part 1 :
  // for (let i = 0; i < +quantity; i++) {
  //   const crate = stacks[from].pop()!
  //   stacks[to].push(crate)
  // }

  const cratesToMove = stacks[from].splice(-quantity)
  stacks[to].push(...cratesToMove)
}

console.log(
  Object.values(stacks)
    .map(stack => stack.at(-1))
    .join(''),
)
