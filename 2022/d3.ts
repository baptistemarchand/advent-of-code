// https://adventofcode.com/2022/day/3 | Run with `deno run --allow-read d3.ts`

const getPriority = (c: string) => (c.toUpperCase() === c ? c.charCodeAt(0) - 65 + 27 : c.charCodeAt(0) - 96)

const part1 = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .map(line => {
    const middle = line.length / 2
    const firstHalf = line.slice(0, middle)
    const secondHalf = line.slice(middle)
    return firstHalf.split('').find(c => secondHalf.includes(c))!
  })
  .map(getPriority)
  .reduce((prev, curr) => prev + curr, 0)

console.log(part1)

const lines = (await Deno.readTextFile('./input.txt')).split('\n')
let total = 0
for (let i = 0; i < lines.length; i += 3) {
  const a = lines[i]
  const b = lines[i + 1]
  const c = lines[i + 2]
  const commonLetter = a.split('').find(x => b.includes(x) && c.includes(x))
  total += getPriority(commonLetter!)
}
console.log(total)
