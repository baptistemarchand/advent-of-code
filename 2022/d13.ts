// https://adventofcode.com/2022/day/13 | Run with `deno run --allow-read d13.ts`

const pairs = (await Deno.readTextFile('./input.txt')).split('\n\n').map(pair => pair.split('\n'))

const parseList = (s: string): string[] => {
  if (!s.includes('[')) {
    s = `[${s}]`
  }

  if (s === '[]') {
    return []
  }

  const result: string[] = []
  let h = 0
  let curr = ''

  for (let i = 1; i < s.length; i++) {
    if (h === 0) {
      if (s[i] === ',' || s[i] === ']') {
        result.push(curr)
        curr = ''
      } else if (s[i] === '[') {
        curr += '['
        h++
      } else {
        curr += s[i]
      }
    } else {
      if (s[i] === '[') {
        h++
      } else if (s[i] === ']') {
        h--
      }
      curr += s[i]
    }
    s[i]
  }

  return result
}

const cmp = (a: string, b: string): 'OK' | 'EQUAL' | 'NOK' => {
  if (a === b) {
    return 'EQUAL'
  }
  if (a == undefined) {
    return 'OK'
  }
  if (b == undefined) {
    return 'NOK'
  }
  if (!a.includes('[') && !b.includes('[')) {
    if (+a < +b) {
      return 'OK'
    }
    if (+a > +b) {
      return 'NOK'
    }
    return 'EQUAL'
  }
  let la = parseList(a)
  let lb = parseList(b)

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

const lines = (await Deno.readTextFile('./input.txt')).split('\n').filter(Boolean)
lines.push('[[2]]', '[[6]]')
lines.sort((a, b) => (cmp(a, b) === 'OK' ? -1 : 1))
console.log((lines.indexOf('[[2]]') + 1) * (lines.indexOf('[[6]]') + 1))
