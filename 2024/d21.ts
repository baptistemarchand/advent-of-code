import {sumOf} from '@std/collections'

const codes = (await Deno.readTextFile('./input.txt')).split('\n')

const lol: Record<string, string[]> = {
  'A 0': ['<'],
  '0 2': ['^'],
  '2 9': ['^^>', '>^^', '^>^'],
  '9 A': ['vvv'],

  'A 9': ['^^^'],
  '9 8': ['<'],
  '8 0': ['vvv'],
  '0 A': ['>'],

  'A 1': ['^<<', '<^<'],
  '1 7': ['^^'],
  '7 9': ['>>'],

  'A 4': ['^^<<', '^<^<', '^<<^', '<^<^', '<^^<'],
  '4 5': ['>'],
  '5 6': ['>'],
  '6 A': ['vv'],

  'A 3': ['^'],
  '3 7': ['^^<<', '<<^^', '^<^<', '<^<^', '<^^<', '^<<^'],

  'A 8': ['^^^<', '^^<^', '^<^^', '<^^^'],
  '0 5': ['^^'],
  '5 A': ['vv>', 'v>v', '>vv'],

  '8 3': ['vv>', 'v>v', '>vv'],
  '3 A': ['v'],

  '1 4': ['^'],
  '4 9': ['>>^', '>^>', '^>>'],

  '4 1': ['v'],
  '1 3': ['>>'],

  'A 5': ['^^<', '^<^', '<^^'],
  '5 8': ['^'],
  '8 2': ['vv'],
  '2 A': ['>v', 'v>'],
}

const lol2: Record<string, string[]> = {
  'A ^': ['<'],
  'A v': ['<v', 'v<'],
  'A >': ['v'],
  'A <': ['<v<', 'v<<'],

  '^ A': ['>'],
  '^ v': ['v'],
  '^ >': ['v>', '>v'],
  '^ <': ['v<'],

  '< ^': ['>^'],
  '< v': ['>'],
  '< >': ['>>'],
  '< A': ['>>^', '>^>'],

  '> ^': ['<^', '^<'],
  '> v': ['<'],
  '> A': ['^'],
  '> <': ['<<'],

  'v ^': ['^'],
  'v A': ['>^', '^>'],
  'v >': ['>'],
  'v <': ['<'],
}

const getPaths = (code: string, mapping: Record<string, string[]>, path = '', curr = 'A'): string[] => {
  if (code === '') {
    return [path]
  }

  const paths = (() => {
    const next = code[0]

    if (next === curr) {
      return [`${path}A`]
    }

    const key = `${curr} ${next}`
    if (!mapping[key]) {
      throw Error(`No key in mapping (${key})`)
    }

    return mapping[key].map(p => `${path}${p}A`)
  })()

  return paths.flatMap(p => getPaths(code.slice(1), mapping, p, code[0]))
}

const coucou = (paths: string[], n: number): number => {
  let min = Infinity

  if (n === 0) {
    for (const path of paths) {
      if (path.length < min) {
        min = path.length
      }
    }
  } else {
    for (const path of paths) {
      const x = coucou(getPaths(path, lol2), n - 1)
      if (x < min) {
        min = x
      }
    }
  }

  return min
}

const getComplexity = (code: string): number => {
  console.log(`CODE ${code}`)

  const paths = getPaths(code, lol)
  const len = coucou(paths, 2)
  console.log(len, parseInt(code.replaceAll('A', ''), 10))
  return len * parseInt(code.replaceAll('A', ''), 10)
}

console.log(sumOf(codes, getComplexity))
