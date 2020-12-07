// https://adventofcode.com/2020/day/6 | Run with `deno run --allow-read d6.ts`

let input = await Deno.readTextFile('input.txt')

const groups = input.trim().replace(/\n/g, ' ').split('  ')

// part 1
console.log(groups.map(group => new Set(group.replace(/ /g, '').split('')).size).reduce((a, b) => a + b))

// part 2
const getGroupSize = (group: string) => {
  const [firsPerson, ...persons] = group.split(' ')
  return persons.reduce((a, b) => a.filter(letter => b.includes(letter)), firsPerson.split('')).length
}
console.log(groups.map(getGroupSize).reduce((a, b) => a + b))

export {} // To prevent isolatedModules error
