---
category: Component
---

# computedInject

Combine `computed` and `inject`. Useful for creating a computed property based on an injected value.

## Usage

In Provider Component

```ts twoslash include main
import type { InjectionKey, Ref } from 'vue'
import { provide, ref } from 'vue'

interface Item {
  key: number
  value: string
}

export const ArrayKey: InjectionKey<Ref<Item[]>> = Symbol('symbol-key')

const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

provide(ArrayKey, array)
```

In Receiver Component

```ts
// @filename: provider.ts
// @include: main
// ---cut---
import { computedInject } from '@vueuse/core'

import { ArrayKey } from './provider'

const computedArray = computedInject(ArrayKey, (source) => {
  const arr = [...source.value]
  arr.unshift({ key: 0, value: 'all' })
  return arr
})
```

### Default Value

You can provide a default value that will be used if the injection key is not provided by a parent component.

```ts
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(
  ArrayKey,
  (source) => {
    return source.value.map(item => item.value)
  },
  ref([]), // default source value
)
```

### Factory Default

Pass `true` as the fourth argument to treat the default value as a factory function.

```ts
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(
  ArrayKey,
  (source) => {
    return source.value.map(item => item.value)
  },
  () => ref([]), // factory function for default
  true, // treat default as factory
)
```

### Writable Computed

You can also create a writable computed property by passing an object with `get` and `set` functions.

```ts
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(ArrayKey, {
  get(source) {
    return source.value.map(item => item.value)
  },
  set(value) {
    // handle setting the value
    console.log('Setting value:', value)
  },
})
```
