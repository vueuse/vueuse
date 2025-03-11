---
category: Reactivity
---

# useLens

Reactive lens for accessing and modifying nested properties with optional transformations and fallbacks.

## Usage

`useLens` creates a writable computed ref to access and modify nested properties in reactive sources like `Ref` or `reactive` objects. It supports objects, arrays, and provides options for fallback values and transformations.

### Basic Usage

Access and modify a nested property in a reactive object:

```ts
import { useLens } from '@vueuse/core'
import { reactive } from 'vue'

const user = reactive({
  profile: {
    name: 'Alice',
    settings: { theme: 'dark' },
  },
})

const name = useLens(user, u => u.profile.name)

console.log(name.value) // 'Alice'
name.value = 'Bob' // Updates user.profile.name to 'Bob'
```

### With Fallback

Handle undefined properties with a fallback:

```ts
const user = reactive({ profile: {} })
const name = useLens(user, u => u.profile.name, { fallback: 'Guest' })

console.log(name.value) // 'Guest'
name.value = 'Eve' // Updates user.profile.name to 'Eve'
```

### With Transformations

Transform values on get and set:

```ts
const data = reactive({ count: '42' })
const count = useLens(data, d => d.count, {
  transform: value => Number.parseInt(value),
  onSet: value => value.toString(),
})

console.log(count.value) // 42 (number)
count.value = 50 // Updates data.count to '50'
```

### Arrays

Work with array elements:

```ts
const items = reactive({ list: ['apple', 'banana'] })
const firstItem = useLens(items, i => i.list[0])

console.log(firstItem.value) // 'apple'
firstItem.value = 'orange' // Updates items.list[0] to 'orange'
```

## Type Declarations

```ts
/**
 * Options for configuring the lens behavior.
 */
interface LensOptions<P, R = P> {
  /** Fallback value if the property is undefined */
  fallback?: P
  /** Transforms the value on both get and set */
  transform?: (value: P) => R
  /** Transforms the value only on get */
  onGet?: (value: P) => R
  /** Transforms the value only on set */
  onSet?: (value: R) => P
}

/**
 * Creates a reactive lens with a required fallback.
 */
export function useLens<T, P>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P> & { fallback: P }
): WritableComputedRef<P>

/**
 * Creates a reactive lens with a transform function.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { transform: (value: P) => R }
): WritableComputedRef<R>

/**
 * Creates a reactive lens with a getter transformation.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { onGet: (value: P) => R }
): WritableComputedRef<R>

/**
 * Creates a reactive lens with a setter transformation.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { onSet: (value: R) => P }
): WritableComputedRef<P>

/**
 * Creates a reactive lens with optional configuration.
 */
export function useLens<T, P>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options?: LensOptions<P>
): WritableComputedRef<P | undefined>
```
