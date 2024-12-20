import {getNumbers} from '../utils.ts'

const [registers, program] = (await Deno.readTextFile('./input.txt')).split('\n\n')

const [A, B, C] = getNumbers(registers)
const ns: readonly number[] = getNumbers(program)

const getResult = (A_: number) => {
  let [a, b, c] = [A_, B, C]
  const out: number[] = []

  const getCombo = (op: number) => {
    if (op <= 3) {
      return op
    }
    if (op === 4) {
      return a
    }
    if (op === 5) {
      return b
    }
    if (op === 6) {
      return c
    }
    throw Error(`Unknown op ${op}`)
  }

  for (let ptr = 0; ns[ptr] != null && ns[ptr + 1] != null; ) {
    const n = ns[ptr]
    const op = ns[ptr + 1]
    const combo = getCombo(op)

    if (n === 0) {
      // adv
      a = a >> combo
    } else if (n === 1) {
      // bxl
      b = b ^ op
    } else if (n === 2) {
      // bst
      b = combo & 0b111
    } else if (n === 3) {
      // jnz
      if (a !== 0) {
        ptr = op
        continue
      }
    } else if (n === 4) {
      // bxc
      b = b ^ c
    } else if (n === 5) {
      // out
      const value = combo & 0b111
      out.push(value)
      // For part 2
      // if (ns[out.length - 1] !== value) {
      //   return false
      // }
    } else if (n === 6) {
      // bdv
      b = a >> combo
    } else if (n === 7) {
      // cdv
      c = a >> combo
    } else {
      throw Error('lol' + n)
    }

    ptr += 2
  }

  if (out.join(',') === ns.join(',')) {
    console.log(A, out.join(','))
    return true
  }

  // For par 1 :
  console.log(out.join(','))
}

// part 1
getResult(A)

// part2 (too slow, does not work)
// for (let i = 0; i < 1000_000; i++) {
//   if (getResult(i)) {
//     break
//   }
// }
