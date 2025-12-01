const [a, b] = (await Deno.readTextFile('./input.txt')).split('\n\n')

const values: any = {}

for (const aa of a.split('\n')) {
  const [gate, raw] = aa.split(':')
  values[gate] = Number(raw)
}

for (const bb of b.split('\n')) {
  const [x, op, y, , out] = bb.split(' ')
  console.log(x, op, y, out)
  values[out] = {op, x, y}
}

console.log(values)

for (const k in values) {
  if (
    typeof values[k] === 'object' &&
    typeof values[values[k].x] !== 'number' &&
    typeof values[values[k].y] !== 'number'
  ) {
    console.log('penis')
  }
}
