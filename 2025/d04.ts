import {adj8, Grid, validate} from '../utils.ts'

let map = await Grid.create('./inputs/d04.txt')

let totalRollsRemoved = 0
let firstRollsRemoved: number | undefined

while (true) {
  let rollsRemoved = 0
  const newMap = map.clone()
  map.walk(({e, p}) => {
    const numberOfAdjacentRolls = adj8(p).filter(np => map.at(np) === '@').length
    if (e === '@' && numberOfAdjacentRolls < 4) {
      rollsRemoved++
      newMap.set(p, '.')
    }
  })

  if (rollsRemoved === 0) {
    break
  }

  totalRollsRemoved += rollsRemoved
  map = newMap

  if (firstRollsRemoved === undefined) {
    firstRollsRemoved = rollsRemoved
  }
}

const part1 = firstRollsRemoved as number
const part2 = totalRollsRemoved

validate('2025/d04', part1, 1370, part2, 8437)
