// https://adventofcode.com/2020/day/14 | Run with `deno run --allow-read d14.ts`

let mask = ''

const applyMask = (n: number) => {
  const b = n.toString(2).padStart(36, '0').split('')
  for (let i = 0; i < 36; i++) {
    b[i] = mask[i] === 'X' ? b[i] : mask[i]
  }
  return parseInt(b.join(''), 2)
}

let lines = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean)
const mem: Record<number, number> = {}

for (const line of lines) {
  if (line.includes('k')) {
    mask = line.replace('mask = ', '')
    continue
  }
  const [addr, value] = line.split('] = ')
  mem[Number(addr.replace('mem[', ''))] = applyMask(Number(value))
}

console.log(Object.values(mem).reduce((a, b) => a + b))

export {} // To prevent isolatedModules error
