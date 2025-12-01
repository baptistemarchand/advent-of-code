const lines = (await Deno.readTextFile('./input.txt')).split('\n')

const g: Record<string, string[]> = {}

for (const line of lines) {
  const [a, b] = line.split('-')
  g[a] ??= []
  g[b] ??= []
  g[a].push(b)
  g[b].push(a)
}

const groups = new Set()

for (const line of lines) {
  const [a, b] = line.split('-')
  for (const n in g) {
    if (n === a || n === b) {
      continue
    }
    const x = a.startsWith('t') || b.startsWith('t') || n.startsWith('t')
    if (g[n].includes(a) && g[n].includes(b) && x) {
      groups.add([a, b, n].sort().join(','))
    }
  }
}

console.log(groups.size)
