// https://adventofcode.com/2022/day/17 | Run with `deno run --allow-read d17.ts`

const valves = {}

;(await Deno.readTextFile('./input.txt')).split('\n').forEach(line => {
  const [_, label, rate, links] = line.match(
    /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/,
  )!
  valves[label] = {
    label,
    rate: +rate,
    links: links.split(', ').map(label => ({target: label, weight: 1})),
  }
})

// console.log(valves)
const getNewLink = (valve: Valve, link: Link, oldWeight: number): Link | null => {
  if (valve.label === link.target) {
    return null
  }
  const existingLink = valve.links.find(l => l.target === link.target)
  if (existingLink) {
    return null
  }

  const weight = link.weight + oldWeight

  // console.log(`Adding link ${valve.label} -> ${link.target} (${weight})`)

  return {target: link.target, weight}
}
const simplify = (valves: Record<string, Valve>) => {
  // console.log()

  const newValves: Record<string, Valve> = {}
  let done = false

  for (const label in valves) {
    const valve = valves[label]
    if (valve.rate !== 0 || valve.label === 'AA' || done) {
      if (!newValves[label]) {
        newValves[label] = {
          label: label,
          rate: valve.rate,
          links: [...valve.links],
        }
      }
      continue
    }
    done = true
    // console.log(`Processing ${label}`, valve)
    const inputs = Object.values(valves).filter(v => v.links.some(n => n.target === valve.label))
    // console.log(`inputs:`, inputs)

    for (const input of inputs) {
      for (const link of valve.links) {
        const oldWeight = input.links.find(l => l.target === valve.label)!.weight
        const newLink = getNewLink(input, link, oldWeight)
        if (newLink) {
          if (!newValves[input.label]) {
            newValves[input.label] = {
              label: input.label,
              rate: valves[input.label].rate,
              links: [...valves[input.label].links],
            }
          }
          // console.log(input.label, newLink)

          newValves[input.label].links.push(newLink)
          // console.log(input.label, newValves[input.label].links)
        }
      }
    }
  }

  for (const label in newValves) {
    newValves[label].links = newValves[label].links.filter(l => newValves[l.target])
  }

  return newValves
}
let xxx = simplify(valves)
while (Object.values(xxx).some(x => x.rate === 0 && x.label !== 'AA')) {
  xxx = simplify(xxx)
}
console.log(xxx)

let currentMax = -1

for (const valve of Object.values(xxx)) {
  valve.links.sort((a, b) => xxx[b.target].rate - xxx[a.target].rate)
}

const allRates = Object.values(xxx)
  .map(v => v.rate)
  .reduce(sum)
// const valveCount = Object.values(valves).length

const isDumb = (path: string) => {
  const vs = path.split('->').filter(Boolean)
  if (vs.length < 3) {
    return false
  }
  for (let i = 0; i < vs.length; i++) {
    if (vs[i] === vs[i + 2]) {
      // console.log(`Dumb path ${path}`)

      return true
    }
  }
  return false
}

const seen: Record<string, number> = {}

let x = 0

const process = (valve: Valve, t: number, total: number, openValves: string[], path: string) => {
  x++
  path += '->' + valve.label

  if (isDumb(path)) {
    return
  }

  seen[valve.label] = 1

  currentMax = Math.max(currentMax, total)

  // if (x % 100 === 0) {
  console.log(`(t=${t}) (total=${total}) (max=${currentMax}) (open=${openValves.join(',')})`.padEnd(70, '.'), path)
  // }

  if (t === 30) {
    return
  }

  const maxPressurePossible = (() => {
    return total + allRates * (30 - t)

    const open = Object.values(xxx).filter(v => openValves.includes(v.label))
    const openTotal = open.map(v => v.rate).reduce(sum, 0)
    const closed = Object.values(xxx).filter(v => !openValves.includes(v.label))
    const timeLeft = 30 - t
    let x = total + openTotal * timeLeft

    let tt = 0
    for (const v of closed.sort((a, b) => b.rate - a.rate)) {
      if (v.rate === 0) {
        continue
      }
      x += v.rate * (timeLeft - tt)
      tt++ // move to the next valve
      tt++ // open it
    }

    return x
  })()
  if (maxPressurePossible <= currentMax) {
    // console.log(`Impossible ${maxPressurePossible} <= ${currentMax}`)
    return
  }

  if (valve.rate && !openValves.includes(valve.label)) {
    const currentTotal = total + openValves.map(v => xxx[v].rate).reduce(sum, 0)
    process(valve, t + 1, currentTotal, [...openValves, valve.label], path)
  }

  for (const node of [...valve.links].sort((a, b) => (seen[a.target] ?? 0) - (seen[b.target] ?? 0))) {
    const currentTotal = total + openValves.map(v => xxx[v].rate).reduce(sum, 0) * node.weight
    process(xxx[node.target], t + node.weight, currentTotal, openValves, path)
  }
}

const start = Date.now()
process(xxx['AA'], 0, 0, [], '')

console.log(currentMax, x, (Date.now() - start) / 1000 + 's')
