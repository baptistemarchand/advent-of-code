import {distinctBy} from '@std/collections'
import {getInput, min, sum} from '../utils.ts'

type Machine = {
  // goal: number
  goal2: number[]
  // ns: number[]
  buttons: number[][]
}

const machines: Machine[] = (await getInput('d10', 'full')).split('\n').map(line => {
  const goal = line
    .match(/\[[.#]+\]/g)?.[0]
    ?.slice(1, -1)
    .split('')
    .map(x => (x === '#' ? 1 : 0))
    .reverse()
    .join('')!

  const goal2 =
    line
      .match(/\{[\d,]+\}/g)?.[0]
      ?.slice(1, -1)
      .split(',')
      .map(Number) ?? []

  const buttons = [...line.matchAll(/\([\d,]+\)/g)].map(m => m[0].slice(1, -1).split(',').map(Number))

  const ns = [...line.matchAll(/\([\d,]+\)/g)].map(m =>
    m[0]
      .slice(1, -1)
      .split(',')
      .map(s => 2 ** +s)
      .reduce(sum),
  )

  return {
    // goal: parseInt(goal, 2),
    goal2,
    buttons,
    // ns,
  }
})
// .filter(m => m.label === '[...#...#.#]')

// console.log(machines)

// const handleMachine = (machine: Machine): number => {
//   let todo: {n: number; depth: number}[] = [{n: 0, depth: 0}]

//   while (todo.length) {
//     const x = todo.shift()!

//     if (x.n === machine.goal) {
//       return x.depth
//     }

//     for (const n of machine.ns) {
//       todo.push({n: x.n ^ n, depth: x.depth + 1})
//       todo = distinctBy(todo, t => `${t.n} ${t.depth}`)
//     }
//   }
// }

const lol = (ns: number[]): number => {
  let result = 1
  outer: for (let i = 2; i <= min(...ns); i++) {
    for (const n of ns) {
      if (n % i !== 0) {
        continue outer
      }
    }
    result = i
  }
  return result
}

const handleMachine2 = (machine: Machine): number => {
  console.log(machine)

  let todo: {n: number[]; depth: number; history: string; alreadyUsedButtons: Record<number, true>}[] = [
    {
      n: [...Array(machine.goal2.length)].map(_ => 0),
      depth: 0,
      history: '',
      alreadyUsedButtons: {},
    },
  ]

  let minRes = Infinity

  outer: while (todo.length) {
    const x = todo.shift()!

    if (x.n.join(',') === machine.goal2.join(',')) {
      minRes = min(minRes, x.depth)
      continue
    }

    for (let i = 0; i < x.n.length; i++) {
      if (x.n[i] > machine.goal2[i]) {
        // console.log('lol', x, machine)

        continue outer
      }
    }

    for (let b = 0; b < machine.buttons.length; b++) {
      if (x.alreadyUsedButtons[b]) {
        continue
      }
      const button = machine.buttons[b]
      const newN = [...x.n]
      const minDiff = lol(button.map(i => machine.goal2[i] - x.n[i]))
      const newAlreadyUsedButtons = {...x.alreadyUsedButtons}
      // newAlreadyUsedButtons[b] = true
      // console.log(minDiff)

      // for (let i = 0; i < x.n.length; i++) {
      //   if (!button.includes(i)) {
      //     continue
      //   }

      //   // const diff = machine.goal2[i] - x.n[i]
      //   // if (diff < minDiff) {
      //   //   minDiff = diff
      //   // }
      // }

      // if (minDiff === 0) {
      //   continue
      // }

      for (let i = 0; i < x.n.length; i++) {
        if (!button.includes(i)) {
          continue
        }

        newN[i] += minDiff
      }

      todo.push({
        n: newN,
        depth: x.depth + minDiff,
        history: `${x.history} (${button.join(',')})*${minDiff}`,
        alreadyUsedButtons: newAlreadyUsedButtons,
      })
      todo = distinctBy(todo, t => `${t.n.join(',')} ${t.depth}`)
    }
  }
  console.log(minRes)

  return minRes
}

const part1 = machines.map(handleMachine2).reduce(sum)

console.log(part1)

// validate('2025/d10', part1, 550, part2, 7264308110)

// console.log(lol([21, 42]))
