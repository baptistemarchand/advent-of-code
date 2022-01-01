// https://adventofcode.com/2020/day/7 | Run with `deno run --allow-read d7.ts`

const rules = (await Deno.readTextFile('input.txt')).split('.\n')

const graph: Record<string, string[]> = {}

for (const rule of rules) {
  const [name, content] = rule.split(' bags contain ')
  if (!graph[name]) {
    graph[name] = []
  }

  if (content === 'no other bags') {
    continue
  }

  const bags = content.split(', ')
  for (const bag of bags) {
    const [_, color] = bag.match(/\d+ ([a-z]+ [a-z]+) bags?/)!
    if (!graph[color]) {
      graph[color] = []
    }
    graph[color].push(name)
  }
}

const getReachableColors = (color: string): string[] => {
  let result = [color]

  const nextColors = graph[color]

  for (const nextColor of nextColors) {
    const reachable = getReachableColors(nextColor)
    result = result.concat(reachable)
  }

  return result
}

const reachable = getReachableColors('shiny gold')
const result = new Set(reachable)

console.log(result.size - 1)

export {} // To prevent isolatedModules error
