// https://adventofcode.com/2023/day/7 | Run with `deno run --allow-read d07.ts`

import {max, reduceMax} from '../utils.ts'

type Hand = {cards: string[]; bid: number}

const parse = async (): Promise<Hand[]> => {
  return (await Deno.readTextFile('./input.txt')).split('\n').map(line => {
    const [cards, bid] = line.split(' ')
    return {
      bid: +bid,
      cards: cards.split(''),
    }
  })
}

const getKind = (cards: string[]): number => {
  const count: Record<string, number> = {}

  for (const card of cards) {
    count[card] ??= 0
    count[card]++
  }

  const counts = Object.values(count)
  const max_ = max(...counts)
  if (max_ === 5) {
    return 6
  }
  if (max_ === 4) {
    return 5
  }
  if (counts.some(c => c === 3) && counts.some(c => c === 2)) {
    return 4
  }
  if (counts.some(c => c === 3)) {
    return 3
  }
  if (counts.filter(c => c === 2).length === 2) {
    return 2
  }
  if (counts.some(c => c === 2)) {
    return 1
  }
  return 0
}

const getKindWithJoker = (cards: string[]) => {
  const hands = [cards]

  const x = (i: number) =>
    cards[i] === 'J' ? ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'] : [cards[i]]

  for (const c1 of x(0)) {
    for (const c2 of x(1)) {
      for (const c3 of x(2)) {
        for (const c4 of x(3)) {
          for (const c5 of x(4)) {
            hands.push([c1, c2, c3, c4, c5])
          }
        }
      }
    }
  }

  return hands.map(getKind).reduce(reduceMax)
}

const getValue = (c: string) => {
  switch (c) {
    case 'A':
      return 14
    case 'K':
      return 13
    case 'Q':
      return 12
    case 'J':
      return 1
    case 'T':
      return 10
    default:
      return +c
  }
}

const hands = await parse()
hands.sort((a, b) => {
  const aa = getKindWithJoker(a.cards)
  const bb = getKindWithJoker(b.cards)

  if (aa > bb) {
    return 1
  }
  if (aa < bb) {
    return -1
  }

  for (let i = 0; i < 5; i++) {
    if (getValue(a.cards[i]) > getValue(b.cards[i])) {
      return 1
    }
    if (getValue(a.cards[i]) < getValue(b.cards[i])) {
      return -1
    }
  }

  return 0
})

let ans = 0

for (let i = 1; i <= hands.length; i++) {
  ans += hands[i - 1].bid * i
}

console.log(ans)
