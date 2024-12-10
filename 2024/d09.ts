const ns = (await Deno.readTextFile('./input.txt')).split('').map(Number)

const getDisk = () => {
  const disk: string[] = []
  for (let i = 0; i < ns.length; i++) {
    for (let j = 0; j < ns[i]; j++) {
      disk.push(i % 2 === 0 ? (i / 2).toString() : '.')
    }
  }
  return disk
}

const getFiles1 = (disk: string[]) => {
  const files: {len: number; x: number}[] = []

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== '.') {
      files.push({len: 1, x: i})
    }
  }

  return files
}

const getFiles2 = (disk: string[]) => {
  const files: {len: number; x: number}[] = []

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === '.') {
      continue
    }

    const id = +disk[i]
    if (!files[id]) {
      files[id] = {len: 1, x: i}
    } else {
      files[id].len++
    }
  }

  return files
}

const defrag = (disk: string[], getFiles: (disk: string[]) => {len: number; x: number}[]) => {
  const files = getFiles(disk)
  for (const f of files.toReversed()) {
    for (let i = 0; i < f.x; i++) {
      if (disk.slice(i, i + f.len).some(c => c !== '.')) {
        continue
      }
      for (let k = 0; k < f.len; k++) {
        disk[i + k] = disk[f.x + k]
        disk[f.x + k] = '.'
      }
      break
    }
  }

  return disk
}

const checksum = (disk: string[]) => {
  let total = 0
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === '.') {
      continue
    }
    total += Number(disk[i]) * i
  }
  return total
}

console.log(checksum(defrag(getDisk(), getFiles1)))
console.log(checksum(defrag(getDisk(), getFiles2)))
