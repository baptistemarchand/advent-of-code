import {Grid, type Point, validate} from '../utils.ts'

let g = await Grid.create('./inputs/d07.txt')

g.walk(({e, p}) => {
  if (e === 'S' || e === '|') {
    const down = p.down()
    switch (g.at(down)) {
      case '.':
        g.set(down, '|')
        break
      case '^': {
        if (g.contains(down.left())) {
          g.set(down.left(), '|')
        }
        if (g.contains(down.right())) {
          g.set(down.right(), '|')
        }
      }
    }
  }
})

let part1 = 0
g.walk(({e, p}) => {
  if (e === '^' && g.at(p.up()) === '|') {
    part1++
  }
})

g = await Grid.create('./inputs/d07.txt')

const cache: Record<string, number> = {}

const explore = (p: Point, timelines = 1): number => {
  if (!g.contains(p)) {
    return timelines
  }

  if (cache[p.toString()]) {
    return cache[p.toString()]
  }

  if (g.at(p) === '^') {
    const result = explore(p.down().left()) + explore(p.down().right())
    cache[p.toString()] = result
    return result
  }

  return explore(p.down(), timelines)
}

const part2 = explore(g.find('S'))

validate('2025/d07', part1, 1628, part2, 27055852018812)
