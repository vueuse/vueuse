---
category: '@Math'
---

# useMathRandom

Reactively get a random integer from a set of numbers

## Usage

### Random integer between two numbers

When you provide exactly two numbers, it returns a random integer between them (inclusive):

```ts
import { useMathRandom } from '@vueuse/math'

const min = ref(1)
const max = ref(10)
const randomInt = useMathRandom(min, max) // Ref<random number between 1 and 10>

// Each time you access randomInt.value, it generates a new random number
console.log(randomInt.value) // e.g., 3
console.log(randomInt.value) // e.g., 7
console.log(randomInt.value) // e.g., 1
```

### Random pick from multiple values

When you provide more than two numbers, it randomly picks one from the array:

```ts
import { useMathRandom } from '@vueuse/math'

const numbers = ref([5, 10, 15, 20, 25])
const randomInt = useMathRandom(numbers) // Randomly picks one: 5, 10, 15, 20, or 25

console.log(randomInt.value) // e.g., 15
console.log(randomInt.value) // e.g., 5
console.log(randomInt.value) // e.g., 20
```

### Using multiple arguments

```ts
import { useMathRandom } from '@vueuse/math'

const a = ref(1)
const b = ref(5)
const randomInt = useMathRandom(a, b, 10, 15) // Randomly picks from: 1, 5, 10, 15

console.log(randomInt.value) // e.g., 10
```

## Type Declarations

```typescript
export function useMathRandom(
  array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>
): ComputedRef<number>

export function useMathRandom(
  ...args: MaybeRefOrGetter<number>[]
): ComputedRef<number>
```
