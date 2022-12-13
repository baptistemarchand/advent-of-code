// https://adventofcode.com/2022/day/13 | Run with `deno run --allow-read d13.ts`

const pairs = (await Deno.readTextFile('./input.txt')).split('\n\n').map(pair => pair.split('\n').map(eval))

const cmp = (a: any, b: any): 'OK' | 'EQUAL' | 'NOK' => {
  if (a == undefined) {
    return 'OK'
  }
  if (b == undefined) {
    return 'NOK'
  }
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) {
      return 'EQUAL'
    }
    return a < b ? 'OK' : 'NOK'
  }

  let la = typeof a === 'number' ? [a] : a
  let lb = typeof b === 'number' ? [b] : b

  while (la.length || lb.length) {
    const c = cmp(la[0], lb[0])
    if (c !== 'EQUAL') {
      return c
    }
    la = la.slice(1)
    lb = lb.slice(1)
  }
  return 'EQUAL'
}

let total = 0

for (let i = 0; i < pairs.length; i++) {
  const [a, b] = pairs[i]

  if (cmp(a, b) === 'OK') {
    total += i + 1
  }
}

console.log(total) // part 1

const lines = (await Deno.readTextFile('./input.txt')).split('\n').filter(Boolean).map(eval)
lines.push([[2]], [[6]])
lines.sort((a, b) => (cmp(a, b) === 'OK' ? -1 : 1))
const linesAsText = lines.map(l => JSON.stringify(l))
console.log((linesAsText.indexOf('[[2]]') + 1) * (linesAsText.indexOf('[[6]]') + 1)) // part 2
