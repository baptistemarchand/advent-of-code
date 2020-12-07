// https://adventofcode.com/2020/day/7 | Run with `deno run --allow-read d7.ts`

const rGraph: Record<string, string[]> = {} // "reverse" graph
const graph: Record<string, [string, number][]> = {}

for (const rule of (await Deno.readTextFile('input.txt')).split('.\n').filter(Boolean)) {
  const [name, content] = rule.split(' bags contain ')
  rGraph[name] = rGraph[name] ?? []
  graph[name] = graph[name] ?? []
  for (const bag of content === 'no other bags' ? [] : content.split(', ')) {
    const [_, count, color] = bag.match(/(\d+) ([a-z]+ [a-z]+) bags?/)!
    ;(graph[name] = graph[name] ?? []).push([color, Number(count)])
    ;(rGraph[color] = rGraph[color] ?? []).push(name)
  }
}

// part 1
const go = (color = 'shiny gold'): string[] => rGraph[color].reduce((result, next) => result.concat(go(next)), [color])
console.log(new Set(go()).size - 1) // Remove one because "shiny gold" is included in the list

// part 2
const go2 = (color = 'shiny gold'): number => graph[color].reduce((total, [next, n]) => total + n * go2(next), 1)

console.log(go2() - 1)

export {} // To prevent isolatedModules error
