---
category: Utilities
---

# useMap

Use [Map API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) more easily.

## Usage

```ts {5}
const { size, keys, values, get, set, has, setAll, remove, reset } = useMap({ a: 1, b: 2 })

console.log(size.value) // 2
console.log(get('a')) // 1

setAll({ c: 3 }) 
console.log(has('c')) // true

reset()
console.log(get('b')) // 2
console.log(has('c')) // false

```
