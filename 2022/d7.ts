// https://adventofcode.com/2022/day/7 | Run with `deno run --allow-read d7.ts`
import {join} from 'https://deno.land/std/path/mod.ts'

import {sum} from '../utils.ts'

const blocks = (await Deno.readTextFile('./input.txt'))
  .split('$ ')
  .filter(Boolean)
  .map(block => block.split('\n').filter(Boolean))

const sizePerDirectory: Record<string, number> = {}
const currentDirectories: string[] = []

for (const [command, ...files] of blocks) {
  if (command === 'cd ..') {
    currentDirectories.pop()
  } else if (command.startsWith('cd')) {
    const dirName = command.slice(3)
    const path = join(currentDirectories.at(-1) ?? '', dirName)
    currentDirectories.push(path)
  } else {
    // ls
    for (const file of files) {
      if (file.startsWith('dir ')) {
        continue
      }

      const size = Number(file.split(' ')[0])
      for (const dir of currentDirectories) {
        if (!sizePerDirectory[dir]) {
          sizePerDirectory[dir] = 0
        }
        sizePerDirectory[dir] += size
      }
    }
  }
}

const unused = 70000000 - sizePerDirectory['/']
const sizeNeeded = 30000000 - unused

console.log(
  // part 1
  Object.values(sizePerDirectory)
    .filter(size => size <= 100_000)
    .reduce(sum),
  // part 2
  Object.values(sizePerDirectory)
    .sort((a, b) => a - b)
    .find(size => size >= sizeNeeded),
)
