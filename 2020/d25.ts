// https://adventofcode.com/2020/day/16 | Run with `deno run --allow-read d16.ts`

const cardPublicKey = 17807724
const doorPublicKey = 5764801
// const cardPublicKey = 14222596
// const doorPublicKey = 4057428

const transform = (subject: number, loopSize: number) => {
  // return 7 ** loopSize % 20201227
  let value = 1
  for (let i = 0; i < loopSize; i++) {
    value = value * subject
    value = value % 20201227
  }
  return value
}

const findLoopSize = (publicKey: number): number => {
  let i = Math.floor(Math.log10(publicKey) / Math.log10(7))
  console.log(i)

  while (true) {
    const t = transform(7, i)
    if (t === publicKey) {
      return i
    }
    i++
  }
  return 0
}

// console.log(findLoopSize(cardPublicKey))
console.log(findLoopSize(doorPublicKey))

// const findLoopSize = (publicKey: number): number => {
//   let i = 1000
//   let x = 0

//   while (true) {
//     x = transform(7, i)
//     console.log(i, x, publicKey)

//     if (x === publicKey) {
//       return i
//     }

//     if (x < publicKey) {
//       i *= 2
//     } else {
//       i--
//     }
//   }
// }

// const test = (i: number) => {
//   const t = transform(7, i)
//   if (t < cardPublicKey) {
//     console.log(t + ' < ' + cardPublicKey)
//   } else if (t > cardPublicKey) {
//     console.log(t + ' > ' + cardPublicKey)
//   } else {
//     console.log('DING DING DING')
//   }
// }

// const cardLoopSize = findLoopSize(cardPublicKey)
// console.log(cardLoopSize)
// const doorLoopSize = findLoopSize(doorPublicKey)
// console.log(doorLoopSize)

// const encryptionKey = transform(cardPublicKey, doorLoopSize)
// const encryptionKey2 = transform(doorPublicKey, cardLoopSize)

// console.log(cardLoopSize, doorLoopSize, encryptionKey, encryptionKey2)

export {} // To prevent isolatedModules error
