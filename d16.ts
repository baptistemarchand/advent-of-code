// https://adventofcode.com/2020/day/16 | Run with `deno run --allow-read d16.ts`

let [fieldsRaw, myTicketRaw, nearbyTickets] = (await Deno.readTextFile('input.txt')).split('\n\n')

const fields = fieldsRaw.split('\n').map(field => {
  const [fieldName, attr] = field.split(': ')
  const ranges = attr.split(' or ')
  return {
    name: fieldName,
    ranges: ranges.map(range => range.split('-').map(x => Number(x))),
  }
})

const isValid = (x: number, field: typeof fields[number]) => {
  for (const [min, max] of field.ranges) {
    if (x <= max && x >= min) {
      return true
    }
  }
  return false
}

const isValidForAnyFields = (x: number) => fields.some(field => isValid(x, field))
const stringToTicket = (s: string) => s.split(',').map(x => Number(x))

let [, ...tickets] = nearbyTickets.split('\n').map(stringToTicket)

let firstStarResult = 0

for (const ticket of tickets) {
  for (const value of ticket) {
    if (!isValidForAnyFields(value)) {
      firstStarResult += value
    }
  }
}

// Second start
const myTicket = stringToTicket(myTicketRaw.split('\n')[1])
const validTickets = tickets.filter(ticketValues => !ticketValues.some(value => !isValidForAnyFields(value)))
validTickets.push(myTicket)

const possibleFields: Record<number, string[]> = {}
for (let i = 0; i < myTicket.length; i++) {
  possibleFields[i] = fields.map(field => field.name)
}

const clean = (field: string) => {
  for (const i in possibleFields) {
    if (possibleFields[i].length === 1) {
      continue
    }
    remove(field, Number(i))
  }
}

const remove = (field: string, i: number) => {
  possibleFields[i] = possibleFields[i].filter(f => f !== field)
  if (possibleFields[i].length === 1) {
    clean(possibleFields[i][0])
  }
}

for (const ticket of validTickets) {
  for (let i = 0; i < ticket.length; i++) {
    for (const field of fields) {
      if (!isValid(ticket[i], field)) {
        remove(field.name, i)
      }
    }
  }
}

let result = 1
for (let i = 0; i < myTicket.length; i++) {
  if (possibleFields[i][0].includes('departure')) {
    result *= myTicket[i]
  }
}
console.log(firstStarResult, result)

export {} // To prevent isolatedModules error
