# reactify

> Converts plain function into reactive function. The converted function accepts refs as it's arguments and returns a ComputedRef, with proper typing.

## Usage

Basic example

```ts
import { reactify } from '@vueuse/core'

// a plain function
function add(a: number, b: number) {
  return a + b
}

const reactiveAdd = reactify(add)

const a = ref(1)
const b = ref(2)

// now it accept refs
const sum = reactiveAdd(a, b)

console.log(sum.value) // 3

a.value = 5

console.log(sum.value) // 7
```

An example of implementing a reactive [Pythagorean theorem](https://en.wikipedia.org/wiki/Pythagorean_theorem).

```ts
import { reactify } from '@vueuse/core'

const pow = reactify(Math.pow)
const sqrt = reactify(Math.sqrt)
const add = reactify((a: number, b: number) => a + b)

const a = ref(3)
const b = ref(4)
const c = sqrt(add(pow(a, 2), pow(b, 2)))
console.log(c.value) // 5

// 5:12:13
a.value = 5
b.value = 12
console.log(c.value) // 13
```

You can do it this way:

```ts
import { reactify } from '@vueuse/core'

function pythagorean(a: number, b: number) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

const a = ref(3)
const b = ref(4)

const c = reactify(pythagorean)(a, b)
console.log(c.value) // 5
```

This is another example of making reactive `stringify`

```ts
import { reactify } from '@vueuse/core'

const stringify = reactify(JSON.stringify)

const obj = ref(42)
const dumped = stringify(obj)

console.log(dumped.value) // '42'

obj.value = { foo: "bar" }

console.log(dumped.value) // '{"foo":"bar"}'
```
