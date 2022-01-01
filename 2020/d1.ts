// https://adventofcode.com/2020/day/1 | Run with `deno run --allow-read d1.ts`

const years = (await Deno.readTextFile('input.txt')).split('\n').map(x => parseInt(x))

for (const a of years) {
  for (const b of years) {
    for (const c of years) {
      if (a + b + c === 2020) {
        console.log(a * b * c)
        Deno.exit()
      }
    }
  }
}

export {} // To prevent isolatedModules error
