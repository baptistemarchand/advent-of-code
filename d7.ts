// https://adventofcode.com/2020/day/7 | Run with `deno run --allow-read d7.ts`

const rules = (await Deno.readTextFile('input.txt')).split('.\n')

const rGraph: Record<string, string[]> = {} // "reverse" graph

for (const rule of rules) {
  const [name, content] = rule.split(' bags contain ')
  if (!rGraph[name]) {
    rGraph[name] = []
  }
  if (content === 'no other bags') {
    continue
  }

  for (const bag of content.split(', ')) {
    const [_, color] = bag.match(/\d+ ([a-z]+ [a-z]+) bags?/)!
    if (!rGraph[color]) {
      rGraph[color] = []
    }
    rGraph[color].push(name)
  }
}

console.log(rGraph)

const getReachableColors = (color: string): string[] => {
  let result = [color]
  const nextColors = rGraph[color]
  for (const nextColor of nextColors) {
    const reachableColors = getReachableColors(nextColor)
    result = result.concat(reachableColors)
  }

  return result
}

console.log(getReachableColors('shiny gold'))

export {} // To prevent isolatedModules error
