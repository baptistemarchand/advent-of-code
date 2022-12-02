// https://adventofcode.com/2022/day/1 | Run with `deno run --allow-read d1.ts`

const result = (await Deno.readTextFile('./input.txt'))
  .split('\n\n')
  .map(e => e.replace(/\n/g, '+'))
  .map(eval)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((prev, curr) => prev + curr, 0)

console.log(result)
