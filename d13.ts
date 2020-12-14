// https://adventofcode.com/2020/day/13 | Run with `deno run --allow-read d13.ts`

const [n, buses] = (await Deno.readTextFile('input.txt')).split('\n')

for (let i = Number(n); ; i++) {
  for (const b of buses.split(',')) {
    if (i % Number(b) === 0) {
      console.log(Number(b) * (i - Number(n)))
      Deno.exit()
    }
  }
}

export {} // To prevent isolatedModules error
