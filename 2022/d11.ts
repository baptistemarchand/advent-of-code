// https://adventofcode.com/2022/day/11 | Run with `deno run --allow-read d11.ts`

const monkeys = (await Deno.readTextFile('./input.txt')).split('\n\n').map(input => {
  const lines = input.split('\n')
  return {
    items: lines[1].split(': ')[1].split(', ').map(BigInt),
    operation: lines[2]
      .split('= ')[1]
      .split(' ')
      .map(x => (['old', '*', '+'].includes(x) ? x : BigInt(x))),
    divisibleAmount: BigInt(lines[3].split('by ')[1]),
    trueMonkey: +lines[4].split('monkey ')[1],
    falseMonkey: +lines[5].split('monkey ')[1],
    count: 0,
  }
})

const timeByOp: Record<string, number> = {
  '23': 0,
  '19': 0,
  '13': 0,
  '17': 0,
  '+': 0,
  '*': 0,
  '%': 0,
}

const apply = (operation: typeof monkeys[0]['operation'], item: bigint): bigint => {
  const startTime = Date.now()
  const [_a, op, _b] = operation
  const a = _a === 'old' ? item : (_a as bigint)
  const b = _b === 'old' ? item : (_b as bigint)

  const result = op === '+' ? a + b : a * b
  timeByOp[op as string] += Date.now() - startTime
  return result
}

const isDivisible = (n: bigint, by: bigint): boolean => {
  const startTime = Date.now()

  // if (by === 17n && n > MAX) {
  //   const asString = n.toString()
  //   const lastDigit = BigInt(asString.at(-1)!)
  //   const rest = asString.substring(0, asString.length - 1)
  //   return isDivisible(BigInt(rest) - lastDigit * 5n, 17n)
  // }

  const result = n % by === 0n
  timeByOp[by.toString()] += Date.now() - startTime
  timeByOp['%'] += Date.now() - startTime
  return result
}

const play = () => {
  // console.time('round')
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      // console.time('item')
      const bigItem = apply(monkey.operation, item)
      const targetMonkey = isDivisible(bigItem, monkey.divisibleAmount) ? monkey.trueMonkey : monkey.falseMonkey
      // console.time('aaa')
      monkeys[targetMonkey].items.push(bigItem)
      // console.timeEnd('aaa')
      monkey.count++
      // console.timeEnd('item')
    }
    monkey.items = []
  }
  // console.timeEnd('round')
}

console.time('FULL')
for (let round = 1; round <= 850; round++) {
  play()
}
console.timeEnd('FULL')

console.log(timeByOp)

// console.log(
//   monkeys
//     .map(m => m.count)
//     .sort((a, b) => b - a)
//     .slice(0, 2)
//     .reduce((a, b) => a * b),
// )
