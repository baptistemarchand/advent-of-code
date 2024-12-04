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

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i + 1]?.[j + 1] !== 'A') {
      continue
    }
    const x = `${lines[i][j]}${lines[i][j + 2]}${lines[i + 2]?.[j]}${lines[i + 2]?.[j + 2]}`
    part2 += +(x === 'MSMS') + +(x === 'SMSM') + +(x === 'SSMM') + +(x === 'MMSS')
  }
}

console.log(part2)
