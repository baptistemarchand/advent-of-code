// https://adventofcode.com/2020/day/9 | Run with `deno run --allow-read d9.ts`

const PREAMBLE = 25

const ns = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean).map(Number)

const getOutlier = () => {
  const check = (n: number, slice: number[]): boolean => {
    for (const a of slice) {
      for (const b of slice) {
        if (a !== b && a + b === n) {
          return true
        }
      }
    }
    return false
  }

  for (let i = PREAMBLE; i < ns.length; i++) {
    if (!check(ns[i], ns.slice(i - PREAMBLE, i))) {
      return ns[i]
    }
  }
}

// part 1
const target = getOutlier()!
console.log(target)

// part 2
for (let i = 0; i < ns.length; i++) {
  let x = ns[i]
  for (let j = i + 1; j < ns.length && x <= target; j++) {
    x += ns[j]
    if (target === x) {
      const s = ns.slice(i, j)
      console.log(Math.min(...s) + Math.max(...s))
      Deno.exit()
    }
  }
}

export {} // To prevent isolatedModules error
