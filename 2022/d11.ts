// https://adventofcode.com/2022/day/11 | Run with `deno run --allow-read d11.ts`

const monkeys = (await Deno.readTextFile('./input.txt')).split('\n\n').map(input => {
  const lines = input.split('\n')
  return {
    items: lines[1].split(': ')[1].split(', ').map(Number),
    operation: lines[2].split('= ')[1],
    divisibleAmount: +lines[3].split('by ')[1],
    trueMonkey: +lines[4].split('monkey ')[1],
    falseMonkey: +lines[5].split('monkey ')[1],
    count: 0,
  }
})

const MAGIC = monkeys.map(m => m.divisibleAmount).reduce((a, b) => a * b)

const play = () => {
  for (const monkey of monkeys) {
    for (let item of monkey.items) {
      item = eval(monkey.operation.replaceAll('old', `${item}`))
      item = item % MAGIC
      const targetMonkey = item % monkey.divisibleAmount === 0 ? monkey.trueMonkey : monkey.falseMonkey
      monkeys[targetMonkey].items.push(item)
      monkey.count++
    }
    monkey.items = []
  }
}

for (let round = 1; round <= 10_000; round++) {
  play()
}

console.log(
  monkeys,
  monkeys
    .map(m => m.count)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b),
)
