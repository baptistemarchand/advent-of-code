// https://adventofcode.com/2023/day/4 | Run with `deno run --allow-read d04.ts`

import {sum} from '../utils.ts'

const cards = (await Deno.readTextFile('./input.txt')).split('\n').map(line => {
  const [name, numbers] = line.replaceAll('  ', ' ').split(': ')
  const [winning, ours] = numbers.split(' | ').map(ns => ns.split(' ').map(n => parseInt(n)))
  return {
    id: parseInt(name.split('Card')[1].trim()) - 1,
    winCount: ours.filter(n => winning.includes(n)).length,
  }
})
// .map(card => (card.winCount ? 2 ** (card.winCount - 1) : 0))
// .reduce(sum)

for (let i = 0; cards[i]; i++) {
  const card = cards[i]
  for (let n = 1; n <= card.winCount; n++) {
    const newCard = {...cards[card.id + n]}
    cards.push(newCard)
  }
}

console.log(cards.length)
