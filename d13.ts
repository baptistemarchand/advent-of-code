// https://adventofcode.com/2020/day/13 | Run with `deno run --allow-read d13.ts`

const [N, buses] = (await Deno.readTextFile('input.txt')).split('\n')
const n = Number(N)

// for (let i = n; ; i++) {
//   for (const b of buses.split(',')) {
//     const id = Number(b)
//     if (i % id === 0) {
//       console.log(id * (i - n))
//       Deno.exit()
//     }
//   }
// }
let t = 0

const bs = buses.split(',').map(b => (b === 'x' ? null : Number(b)))

const matches = (n: number) => {
  t++
  for (let i = 0; i < bs.length; i++) {
    const a = bs[i]
    if (a && (n + i) % a) {
      return false
    }
  }
  return true
}

let i = 0
while (!matches(i)) {
  i += bs[0]!
}

console.log(i, t)

export {} // To prevent isolatedModules error
