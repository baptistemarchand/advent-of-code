// https://adventofcode.com/2020/day/10 | Run with `deno run --allow-read d10.ts`

const lines = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean)
const ns = lines.map(Number).sort((a, b) => a - b)

let x = 0
const diff: Record<number, number> = {1: 0, 3: 1}

for (const n of ns) {
  const d = n - x
  if (d <= 3) {
    diff[d]++
    x = n
  }
}

console.log(diff[1] * diff[3])

// part 2

const end = ns[ns.length - 1] + 3
const cache: Record<number, number> = {}
const go = (x = 0): number => {
  if (cache[x]) {
    return cache[x]
  }
  if (end - x <= 3) {
    return 1
  }
  const next = ns.filter(n => n > x && n <= x + 3)
  return (cache[x] = next.map(go).reduce((a, b) => a + b))
}

console.log(go())

export {} // To prevent isolatedModules error
