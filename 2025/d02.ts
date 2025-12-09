import {getInput, validate} from '../utils.ts'

const ranges = (await getInput('d02')).split(',')

const isEqualParts = (s: string, numberOfParts: number) => {
  const len = s.length
  const sectionLen = len / numberOfParts
  const firstSection = s.slice(0, sectionLen)

  for (let i = 1; i < numberOfParts; i++) {
    const currentSection = s.slice(i * sectionLen, i * sectionLen + sectionLen)

    if (firstSection !== currentSection) {
      return false
    }
  }

  return true
}

const isInvalid = (n: number) => {
  const s = n.toString()

  for (let numberOfParts = 2; numberOfParts <= s.length; numberOfParts++) {
    if (isEqualParts(s, numberOfParts)) {
      return true
    }
  }

  return false
}

let [part1, part2] = [0, 0]

for (const range of ranges) {
  const [from, to] = range.split('-').map(Number)

  for (let i = from; i <= to; i++) {
    if (isEqualParts(i.toString(), 2)) {
      part1 += i
    }
    if (isInvalid(i)) {
      part2 += i
    }
  }
}

validate('2025/d02', part1, 52316131093, part2, 69564213293)
