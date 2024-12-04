const lines = (await Deno.readTextFile('./input.txt')).split('\n')

let part1 = 0
let part2 = 0

const countMatches = (line: string) => [...line.matchAll(/XMAS/g), ...line.matchAll(/SAMX/g)].length

for (let i = 0; i < lines.length; i++) {
  // Horizontal matches
  part1 += countMatches(lines[i])
  // Vertical matches
  part1 += countMatches(lines.map(line => line[i]).join(''))
}

// Diagonal matches
for (let i = -lines[0].length; i < lines[0].length * 2; i++) {
  part1 += countMatches(lines.map((line, j) => line[i + j]).join(''))
  part1 += countMatches(lines.map((line, j) => line[i - j]).join(''))
}

console.log(part1)

for (let i = 1; i < lines.length - 1; i++) {
  for (let j = 1; j < lines[i].length - 1; j++) {
    if (lines[i][j] !== 'A') {
      continue
    }
    const x = `${lines[i - 1][j - 1]}${lines[i - 1][j + 1]}${lines[i + 1][j - 1]}${lines[i + 1][j + 1]}`
    part2 += +['MSMS', 'SMSM', 'SSMM', 'MMSS'].includes(x)
  }
}

console.log(part2)
