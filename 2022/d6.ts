// https://adventofcode.com/2022/day/6 | Run with `deno run --allow-read d6.ts`

const input = (await Deno.readTextFile('./input.txt')).split('')

const allLettersDifferent = (letters: string[]) => {
  const seenLetters = new Set<string>()
  for (const letter of letters) {
    if (seenLetters.has(letter)) {
      return false
    }
    seenLetters.add(letter)
  }
  return true
}

const MARKER_LENGTH = 14

for (let i = 0; i < input.length - MARKER_LENGTH; i++) {
  const batch = input.slice(i, i + MARKER_LENGTH)
  if (allLettersDifferent(batch)) {
    console.log(i + MARKER_LENGTH)
    Deno.exit()
  }
}
