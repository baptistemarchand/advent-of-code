// https://adventofcode.com/2020/day/7 | Run with `deno run --allow-read d7.ts`

const lineToInstruction = (instruction: string): [string, number] => {
  const [ins, n] = instruction.split(' ')
  return [ins, parseInt(n)]
}
const instructions = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean).map(lineToInstruction)

const go = (instructions: [string, number][], nullOnLoop = false) => {
  let acc = 0
  let cur = 0
  for (const seen: Record<number, boolean> = {}; instructions[cur] && !seen[cur]; seen[cur++] = true) {
    const [ins, n] = instructions[cur]

    if (ins === 'acc') {
      acc += n
    } else if (ins === 'jmp') {
      cur += n - 1
    }
  }
  return !instructions[cur] || !nullOnLoop ? acc : null
}

// part 1
console.log(go(instructions))

// part 2
for (let i = 0; i < instructions.length; i++) {
  const [ins] = instructions[i]
  if (ins === 'acc') {
    continue
  }
  const copy = instructions.map(([a, b]): [string, number] => [a, b])
  copy[i][0] = copy[i][0] === 'jmp' ? 'nop' : 'jmp'
  const result = go(copy, true)
  if (result) {
    console.log(result)
    break
  }
}

export {} // To prevent isolatedModules error
