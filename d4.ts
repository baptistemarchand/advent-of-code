// Run with `deno run --allow-read d4.ts`

let input = await Deno.readTextFile('input.txt')

const stringToPassport = (line: string) => {
  const passport: Record<string, string> = {}
  for (const field of line.trim().split(' ')) {
    const [fieldName, fieldValue] = field.split(':')
    passport[fieldName] = fieldValue
  }
  return passport
}

const passports = input.replace(/\n/g, ' ').split('  ').map(stringToPassport)

const validPassports = passports.filter(p => {
  if (!p.byr || p.byr.length !== 4 || parseInt(p.byr) < 1920 || parseInt(p.byr) > 2002) {
    return false
  }
  if (!p.iyr || p.iyr.length !== 4 || parseInt(p.iyr) < 2010 || parseInt(p.iyr) > 2020) {
    return false
  }
  if (!p.eyr || p.eyr.length !== 4 || parseInt(p.eyr) < 2020 || parseInt(p.eyr) > 2030) {
    return false
  }
  const unit = p.hgt?.slice(-2)
  if (unit !== 'cm' && unit !== 'in') {
    return false
  }
  const height = parseInt(p.hgt?.slice(0, -2), 10)
  if (unit === 'cm' && (height < 150 || height > 193)) return false
  if (unit === 'in' && (height < 59 || height > 76)) return false

  if (p.hcl?.[0] !== '#') return false
  const color = p.hcl?.slice(1)
  if (color?.length !== 6) return false
  if (color.match(/[^0-9a-f]/)) return false
  if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(p.ecl)) {
    return false
  }
  if (p.pid?.length !== 9) return false
  if (p.pid.match(/[^0-9]/)) return false

  return true
})

console.log(validPassports.length)

export {} // To prevent isolatedModules error
