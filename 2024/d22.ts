const ns = (await Deno.readTextFile('./input.txt')).split('\n').map(Number)

const getNext = (n_: number): [Record<string, number>, bigint] => {
  let n = BigInt(n_)

  const res: Record<string, number> = {}

  const diffs = []
  let prev
  for (let i = 0; i < 2000; i++) {
    const unit = +n.toString().slice(-1)
    const diff: number | null = prev != null ? unit - prev : null
    diffs.push(diff)
    res[`${diffs[i - 3]},${diffs[i - 2]},${diffs[i - 1]},${diffs[i]}`] =
      res[`${diffs[i - 3]},${diffs[i - 2]},${diffs[i - 1]},${diffs[i]}`] ?? unit
    // console.log(n, +n.toString().slice(-1))

    prev = unit

    n ^= n * BigInt(64)
    // n ^= n << 6
    n = n % BigInt(16777216)
    n ^= n / BigInt(32)
    // n ^= n >> 5
    n = n % BigInt(16777216)
    n ^= n * BigInt(2048)
    // n ^= n << 11
    n = n % BigInt(16777216)
  }

  return [res, n]
}

const lol: Record<number, Record<string, number>> = {}

let xxx = BigInt(0)
for (const n of ns) {
  const [a, b] = getNext(n)
  lol[n] = a
  xxx += b
}
// console.log(xxx)

// console.log(lol)

let max = 0

for (let a = -9; a <= 9; a++) {
  for (let b = -9; b <= 9; b++) {
    for (let c = -9; c <= 9; c++) {
      for (let d = -9; d <= 9; d++) {
        let total = 0
        for (const n of ns) {
          total += lol[n][`${a},${b},${c},${d}`] ?? 0
        }
        if (total > max) {
          // console.log(`${a},${b},${c},${d}`)
          max = total
        }
        // console.log(max)
      }
    }
  }
}
// -1,0,-1,2

// for (const n of ns) {
//   // max += lol[n]['-1,0,-1,2'] ?? 0
//   console.log(lol[n]['3,2,-1,2'])
// }
console.log(max)

// 2274 too high
