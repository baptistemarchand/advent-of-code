const ranges = (await Deno.readTextFile('./input.txt')).split(',')

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

let result = 0

for (const range of ranges) {
  const [from, to] = range.split('-').map(Number)

  for (let i = from; i <= to; i++) {
    if (isInvalid(i)) {
      result += i
    }
  }
}

console.log(result)
