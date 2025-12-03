const lines = (await Deno.readTextFile('./input.txt')).split('\n')
const banks = lines.map(line => line.split('').map(Number))

const getMax = (bank: number[], numberOfDigits: number): number => {
  let result = 0

  let lastIndex = -1

  for (let i = numberOfDigits - 1; i >= 0; i--) {
    const sub = bank.slice(lastIndex + 1, bank.length - i)

    const digit = Math.max(...sub)
    // console.log(i, bank.join(''), sub.join(''), digit)
    result += digit * 10 ** i
    lastIndex += 1 + sub.findIndex(x => x === digit)
  }

  // console.log(bank.join(''), '===>', result)

  return result
}

let result = 0

for (const bank of banks) {
  result += getMax(bank, 12)
}

console.log(result)
