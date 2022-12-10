// https://adventofcode.com/2022/day/10 | Run with `deno run --allow-read d10.ts`

const instructions = (await Deno.readTextFile('./input.txt')).split('\n')

let cycle = 1
let addxCycle = 1
let total = 0

let sprite = 1
let output = ''

for (let i = 0; i < instructions.length; cycle++) {
  const instruction = instructions[i]

  output = output.concat(Math.abs(sprite - ((cycle - 1) % 40)) < 2 ? '#' : '.')
  if ((cycle - 40) % 40 === 0) {
    output = output.concat('\n')
  }

  if ((cycle - 20) % 40 === 0) {
    total += sprite * cycle
  }

  if (instruction === 'noop') {
    i++
  } else {
    if (addxCycle === 2) {
      sprite += +instruction.split(' ')[1]
      addxCycle = 1
      i++
    } else {
      addxCycle++
    }
  }
}

console.log(total, '\n', output)
