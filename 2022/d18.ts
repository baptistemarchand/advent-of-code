// https://adventofcode.com/2022/day/18 | Run with `deno run --allow-read d18.ts`

const lines_ = (await Deno.readTextFile('./input.txt')).split('\n')

const neighbours = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, -1],
  [0, -1, 0],
  [-1, 0, 0],
]

const getSurface = (xs: string[]) => {
  let total = 0
  for (const line of xs) {
    const [x, y, z] = line.split(',').map(Number)
    const existingNeighbours = neighbours
      .map(([dx, dy, dz]) => [dx + x, dy + y, dz + z].join(','))
      .filter(n => xs.includes(n))

    total += 6 - existingNeighbours.length
  }
  return total
}

console.log(getSurface(lines_))

const getTrapped = (lines: string[]) => {
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  for (const line of lines) {
    const [x, y, z] = line.split(',').map(Number)
    if (x > maxX) {
      maxX = x
    }
    if (y > maxY) {
      maxY = y
    }
    if (z > maxZ) {
      maxZ = z
    }
    if (x < minX) {
      minX = x
    }
    if (y < minY) {
      minY = y
    }
    if (z < minZ) {
      minZ = z
    }
  }
  console.log(minX, minY, minZ, maxX, maxY, maxZ)
  const cache: Record<string, boolean> = {}
  const inProgress: Set<string> = new Set()

  const isConnectedToOutside = (x: number, y: number, z: number, currentPath: string[] = []) => {
    const key = [x, y, z].join(',')
    if (cache[key] !== undefined) {
      return cache[key]
    }
    inProgress.add(key)
    // console.log(currentPath.map(x => ' ').join('') + key)

    if (x <= minX || x >= maxX || y <= minY || y >= maxY || z <= minZ || z >= maxZ) {
      cache[key] = true
      // console.log(currentPath.map(x => ' ').join(''), currentPath)

      return true
    }

    if (lines.includes(key)) {
      cache[key] = false
      return false
    }

    neighbours.sort(([ax, ay, az], [bx, by, bz]) => {
      const ka: string = [x + ax, y + ay, z + az].join(',')
      const kb: string = [x + bx, y + by, z + bz].join(',')
      const a = Number(inProgress.has(ka))
      const b = Number(inProgress.has(kb))

      return a - b
    })

    for (const [dx, dy, dz] of neighbours) {
      const k = [x + dx, y + dy, z + dz].join(',')
      if (currentPath.includes(k)) {
        // console.log(currentPath.map(x => ' ').join('') + 'In path')

        continue
      }
      if (cache[k] || isConnectedToOutside(x + dx, y + dy, z + dz, [...currentPath, k])) {
        cache[k] = true
        // console.log(`${key} is connected throw ${k}`)
        return true
      }
    }
    // console.log(currentPath.map(x => ' ').join('') + 'nope', key)

    cache[key] = false
    return false
  }

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const key = [x, y, z].join(',')
        if (lines.includes(key)) {
          cache[key] = false
        }
      }
    }
  }

  const trapped: string[] = []
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const key = [x, y, z].join(',')
        const isConnectedToOutsidea = isConnectedToOutside(x, y, z)
        // console.log(`${key} ${isConnectedToOutsidea}`)

        if (!lines.includes(key) && !isConnectedToOutsidea) {
          trapped.push(key)
        }
      }
    }
  }

  return trapped
}

const getSurface2 = (lines: string[]): number => {
  const trapped = getTrapped(lines)
  console.log(trapped)

  if (trapped.length === 0) {
    return getSurface(lines)
  }
  return getSurface2([...lines, ...trapped])
}

console.log(getSurface2(lines_))

// let minX = Infinity
// let minY = Infinity
// let minZ = Infinity
// let maxX = -Infinity
// let maxY = -Infinity
// let maxZ = -Infinity

// for (const line of lines_) {
//   const [x, y, z] = line.split(',').map(Number)
//   if (x > maxX) {
//     maxX = x
//   }
//   if (y > maxY) {
//     maxY = y
//   }
//   if (z > maxZ) {
//     maxZ = z
//   }
//   if (x < minX) {
//     minX = x
//   }
//   if (y < minY) {
//     minY = y
//   }
//   if (z < minZ) {
//     minZ = z
//   }
// }

// let count = 0
// for (let z = minZ; z <= maxZ; z++) {
//   for (let y = minY; y <= maxY; y++) {
//     for (let x = minX; x <= maxX; x++) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }
// for (let z = minZ; z <= maxZ; z++) {
//   for (let y = minY; y <= maxY; y++) {
//     for (let x = maxX; x >= minX; x--) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }

// for (let z = minZ; z <= maxZ; z++) {
//   for (let x = minX; x <= maxX; x++) {
//     for (let y = minY; y <= maxY; y++) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }
// for (let z = minZ; z <= maxZ; z++) {
//   for (let x = minX; x <= maxX; x++) {
//     for (let y = maxY; y >= minY; y--) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }

// for (let x = minX; x <= maxX; x++) {
//   for (let y = minY; y <= maxY; y++) {
//     for (let z = minZ; z <= maxZ; z++) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }
// for (let x = minX; x <= maxX; x++) {
//   for (let y = minY; y <= maxY; y++) {
//     for (let z = maxZ; z >= minZ; z--) {
//       const key = [x, y, z].join(',')
//       if (lines_.includes(key)) {
//         count++
//         break
//       }
//     }
//   }
// }

// console.log(count)
