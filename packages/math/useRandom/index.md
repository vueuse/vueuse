---
category: '@Math'
---

# useRandom

Reactively pick random values (numbers or strings) with SSR-safe seeded defaults

## Usage

### Random integer between two numbers

When you provide exactly two numbers, it returns a random integer between them (inclusive):

```ts
import { useRandom } from '@vueuse/math'

const min = ref(1)
const max = ref(10)
const randomInt = useRandom(min, max) // Ref<random number between 1 and 10>

// SSR and the client initial render use a seeded pseudo-random generator to avoid hydration mismatch;
// the client may randomize again after mount.
console.log(randomInt.value) // e.g., 3
console.log(randomInt.value) // e.g., 7
console.log(randomInt.value) // e.g., 1
```

### Random pick from multiple values

When you provide more than two numbers, it randomly picks one from the array:

```ts
import { useRandom } from '@vueuse/math'

const numbers = ref([5, 10, 15, 20, 25])
const randomInt = useRandom(numbers) // Randomly picks one: 5, 10, 15, 20, or 25

console.log(randomInt.value) // e.g., 15
console.log(randomInt.value) // e.g., 5
console.log(randomInt.value) // e.g., 20
```

Note: when the value list contains strings, string-picking mode is used (see below).

### Using multiple arguments

```ts
import { useRandom } from '@vueuse/math'

const a = ref(1)
const b = ref(5)
const randomInt = useRandom(a, b, 10, 15) // Randomly picks from: 1, 5, 10, 15

console.log(randomInt.value) // e.g., 10
```

### Array + count (unique picks)

You can pass an array as the first argument and an optional second numeric argument `count` to pick multiple unique items.

```ts
import { useRandom } from '@vueuse/math'

const items = ref([1, 2, 3, 4, 5])
const picks = useRandom(items, 3) // Ref<number[] | undefined>

console.log(picks.value) // e.g., [4,1,3]
```

On SSR / before mount the returned array is deterministic (first n items). On client after mount the returned array is either seeded-random or native-random depending on global flags (see below).

### Strings

If any of the provided values are strings, `useRandom` operates in string mode. If fewer than two strings are available, it returns `undefined` to avoid ambiguous randomness.

```ts
const s = useRandom('a', 'b', 'c') // Ref<string | undefined>
```

### No valid input

If no valid input is provided (empty array, single string, or no args), the hook returns `undefined`.

```ts
const none = useRandom()
console.log(none.value) // undefined
```

## Type Declarations

```typescript
export function useRandom(
  array: MaybeRefOrGetter<MaybeRefOrGetter<number | string>[]>,
  count?: MaybeRefOrGetter<number>
): Ref<number | string | Array<number | string> | undefined>

export function useRandom(
  ...args: MaybeRefOrGetter<number | string>[]
): Ref<number | string | Array<number | string> | undefined>
```

## SSR and seeded PRNG

To avoid hydration mismatch the hook uses a deterministic seeded PRNG on the server and for the client's initial render. The seed is derived from the input values. On the client a global state is available on `window`:

- `window.__VUEUSE_RANDOM_SEED` — initial seed used by the PRNG (number)
- `window.__VUEUSE_RANDOM_COUNTER` — counter used to continue the seeded sequence between calls
- `window.__VUEUSE_RANDOM_USE_NATIVE` — if truthy, client regenerations will use native `Math.random()` instead of the seeded PRNG

You may set or inspect these globals to customize runtime behavior.
