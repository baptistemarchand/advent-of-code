let input = await Deno.readTextFile("input.txt");
const map: string[] = []
for (const line of input.split('\n').filter(Boolean)) {
    map.push(line)
}
const width = map[0].length
const height = map.length

const get = (x: number, y: number) => {
    return map[y][x%width]
}

let x = 0
let y = 0
let count = 0
while (y < height) {
    if (get(x,y) === '#') {count++}
    x += 1
    y += 2
}
console.log(count);


export {}