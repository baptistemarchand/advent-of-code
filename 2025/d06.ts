import {Grid, getInput, getNumbers, mul, sum, validate} from '../utils.ts'

const allLines = (await getInput('d06')).split('\n')
const lines = allLines.slice(0, allLines.length - 1)
const ops = [...allLines.at(-1)!.matchAll(/[+*]/g)].map(m => m[0]).reverse()

const solve = (ns: number[], i: number) => ns.reduce(ops[i] === '+' ? sum : mul)

const part1 = new Grid(lines.map(getNumbers)).rotateCounterClockwise().g.map(solve).reduce(sum)

const part2 = new Grid(lines.map(l => l.split('')))
  .rotateCounterClockwise()
  .toString()
  .split(/\n *\n/)
  .map(getNumbers)
  .map(solve)
  .reduce(sum)

validate('2025/d06', part1, 5361735137219, part2, 11744693538946)
