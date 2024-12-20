import {sumOf} from '@std/collections'

const [patterns_, designs_] = (await Deno.readTextFile('./input.txt')).split('\n\n')
const patterns = patterns_.split(', ')
const designs = designs_.split('\n')

const cache: Record<string, number> = {}

const getArrangementCount = (design: string): number => {
  if (cache[design] != null) {
    return cache[design]
  }

  if (!design) {
    return 1
  }

  return (cache[design] = sumOf(
    patterns.filter(pattern => design.startsWith(pattern)),
    pattern => getArrangementCount(design.slice(pattern.length)),
  ))
}

let [part1, part2] = [0, 0]

for (const design of designs) {
  const count = getArrangementCount(design)
  part1 += +!!count
  part2 += count
}

console.log(part1, part2)
