// https://adventofcode.com/2022/day/1 | Run with `deno run --allow-read d1.ts`

import {sum} from '../utils.ts'

const result = (await Deno.readTextFile('./input.txt'))
  .split('\n\n')
  .map(e => e.replaceAll('\n', '+'))
  .map(eval)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce(sum)

console.log(result)
