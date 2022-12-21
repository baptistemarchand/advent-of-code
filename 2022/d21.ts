// https://adventofcode.com/2022/day/21 | Run with `deno run --allow-read d21.ts`

const lines = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(': '))

const part1 = () => {
  const monkeys: Record<string, number> = {}

  while (!monkeys['root']) {
    for (const [id, instruction] of lines) {
      if (!instruction.includes(' ')) {
        monkeys[id] = Number(instruction)
        continue
      }

      const [m1, op, m2] = instruction.split(' ')

      if (monkeys[m1] && monkeys[m2]) {
        monkeys[id] = eval(`${monkeys[m1]} ${op} ${monkeys[m2]}`)
      }
    }
  }
  return monkeys['root']
}

console.log(part1())

// part 2

const part2 = () => {
  const monkeys: Record<string, number> = {}

  while (!monkeys['humn']) {
    for (const [id, instruction] of lines) {
      if (id === 'humn') {
        continue
      }
      if (!instruction.includes(' ')) {
        monkeys[id] = Number(instruction)
        continue
      }

      const [m1, op, m2] = instruction.split(' ')

      if (id === 'root') {
        monkeys[m2] ??= monkeys[m1]
        monkeys[m1] ??= monkeys[m2]
        continue
      }

      if (monkeys[m1] && monkeys[m2]) {
        monkeys[id] = eval(`${monkeys[m1]} ${op} ${monkeys[m2]}`)
        continue
      }

      if ((monkeys[id] && monkeys[m1]) || (monkeys[id] && monkeys[m2])) {
        const [emptyMonkey, otherMonkey] = monkeys[m1] ? [m2, m1] : [m1, m2]

        monkeys[emptyMonkey] = (() => {
          if (op === '+') {
            return monkeys[id] - monkeys[otherMonkey]
          }
          if (op === '-') {
            return monkeys[otherMonkey] + monkeys[id] * (emptyMonkey === m1 ? 1 : -1)
          }
          if (op === '*') {
            return monkeys[id] / monkeys[otherMonkey]
          }
          if (op === '/') {
            return monkeys[otherMonkey] * monkeys[id] ** (emptyMonkey === m1 ? 1 : -1)
          }
        })()!
      }
    }
  }
  return monkeys['humn']
}

console.log(part2())
