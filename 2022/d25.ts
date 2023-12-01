// https://adventofcode.com/2022/day/25 | Run with `deno run --allow-read d25.ts`

const ns = (await Deno.readTextFile('./input.txt')).split('\n').map(l => l.split(''))

type SnafuChar = '0' | '1' | '2' | '-' | '='
type Snafu = SnafuChar[]
const values: Record<SnafuChar, number> = {
  '=': -2,
  '-': -1,
  '0': 0,
  '1': 1,
  '2': 2,
}
const getNextSymbol = (s: SnafuChar): SnafuChar | null => {
  return {
    '=': '-',
    '-': '0',
    '0': '1',
    '1': '2',
    '2': null,
  }[s] as any
}

const getDecimal = (snafu: SnafuChar[]): number => {
  let total = 0
  for (let i = snafu.length - 1; i >= 0; i--) {
    const currentSymbol = snafu[i]
    const currentDigit = values[currentSymbol]
    const dizaine = snafu.length - 1 - i
    const dizaineValue = 5 ** dizaine
    const a = dizaineValue * currentDigit
    // console.log({currentDigit, dizaine, dizaineValue})

    total += a
  }
  return total
}

let t = 0
for (const n of ns) {
  const dec = getDecimal(n as SnafuChar[])
  t += dec
}
// 28927640190471
// 4890
// console.log(t)

const addOne = (s: Snafu): Snafu => {
  const ns = [...s]
  for (let i = s.length - 1; i >= 0; i--) {
    const lastSymbol = s[i]
    // console.log(`Processing ${lastSymbol}`)

    const nextSymbol = getNextSymbol(lastSymbol)

    if (nextSymbol) {
      ns[i] = nextSymbol
      break
    }
    ns[i] = '='
  }
  if (ns[0] === '=') {
    return ['1', ...ns]
  }
  return ns
}

const add = (s1: Snafu, s2: Snafu): Snafu => {
  const total: Snafu = []
  let retenue = 0

  for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
    const d1 = s1[s1.length - 1 - i]
    const d2 = s2[s2.length - 1 - i]
    const nd = values[d1] + values[d2]
    if (nd < 3 && nd > -3) {
      const symbol = ['=', '-', '0', '1', '2'][nd + 2]
      total.push(symbol as SnafuChar)
    } else if (nd > 2) {
      retenue = nd - 2
    }
  }
  return s1
}

const test = (x: string) => {
  const s = x.split('') as Snafu
  console.log(getDecimal(s))
  const a = addOne(s)
  console.log(a, getDecimal(a))
}

let tt: Snafu = ['0']
for (const n of ns) {
  tt = add(tt, n as Snafu)
}
console.log(tt)

// 2= + 2=  = 4 + -4 = -2
// 3  + 3   = 6
