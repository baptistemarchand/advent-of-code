// https://adventofcode.com/2020/day/15 | Run with `deno run --allow-read d15.ts`

let numbers = (await Deno.readTextFile('input.txt')).split(',').map(n => Number(n))

const lastSeenOnTurn: Record<number, number> = {}

for (let i = 0; i < numbers.length - 1; i++) {
  lastSeenOnTurn[numbers[i]] = i + 1
}

let lastNumber = numbers[numbers.length - 1]
let currentNumber = 0

for (let i = numbers.length + 1; i <= 2020; i++) {
  if (!lastSeenOnTurn[lastNumber]) {
    currentNumber = 0
  } else {
    currentNumber = i - 1 - lastSeenOnTurn[lastNumber]
  }

  lastSeenOnTurn[lastNumber] = i - 1
  lastNumber = currentNumber
}

console.log(currentNumber)

export {} // To prevent isolatedModules error
