// Run with `deno run --allow-read d5.ts`

let input = await Deno.readTextFile('input.txt')

const passports = input.trim().split('\n')

const getId = (passport: string) => {
  const row = parseInt(passport.slice(0, 7).replace(/F/g, '0').replace(/B/g, '1'), 2)
  const column = parseInt(passport.slice(7).replace(/L/g, '0').replace(/R/g, '1'), 2)
  return row * 8 + column
}

const ids = passports.map(getId)

// part 1
console.log(Math.max(...ids))

// part 2
const sorted = ids.sort((a, b) => a - b)
const nextId = sorted.find((id, i) => id !== sorted[0] + i)!

console.log(nextId - 1)

export {} // To prevent isolatedModules error
