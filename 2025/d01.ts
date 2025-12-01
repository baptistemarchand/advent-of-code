const lines = (await Deno.readTextFile('./input.txt')).split('\n')

let x = 50
let result = 0

for (const line of lines) {
  const n = Number(line.slice(1))
  const inc = line[0] === 'R' ? 1 : -1

  for (let i = 0; i < n; i++) {
    x += inc

    // For part 1, move this part outside the loop
    if (x % 100 === 0) {
      result++
    }
  }
}

console.log(result)
