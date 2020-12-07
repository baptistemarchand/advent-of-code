// https://adventofcode.com/2020/day/2 | Run with `deno run --allow-read d2.ts`

const passwords = (await Deno.readTextFile('input.txt')).split('\n').filter(Boolean)

const f1 = (line: string) => {
  const [_, min, max, letter, password] = line.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/)!
  const count = password.split('').filter(c => c == letter).length
  return Number(min) <= count && Number(max) >= count
}

const f2 = (line: string) => {
  const [_, i1, i2, letter, password] = line.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/)!
  return Number(password[Number(i1) - 1] === letter) + Number(password[Number(i2) - 1] === letter) === 1
}

// part 1
console.log(passwords.filter(f1).length)

// part 2
console.log(passwords.filter(f2).length)

export {} // To prevent isolatedModules error
