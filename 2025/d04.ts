import {adj8, Grid} from '../utils.ts'

let map = await Grid.create('./input.txt')

let totalRollsRemoved = 0

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
  // For part 1:
  // break
}

console.log(totalRollsRemoved)
