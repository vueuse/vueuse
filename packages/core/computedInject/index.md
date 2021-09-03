---
category: Component
---

# computedInject

Combine computed and inject

## Usage

In Provider Component
```ts
import { InjectionKey, provide, Ref, ref } from 'vue-demi';

export const ArrayKey: InjectionKey<Ref<{ key: number, value: string }[]>> = Symbol()

const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

provide(ArrayKey, array)
```

In Receiver Component
```ts
import { computedInject } from '@vueuse/core'

import { ArrayKey } from "./provider"

const computedArray = computedInject(ArrayKey, (source) => {
  const arr = [...source.value]
  arr.unshift({ key: 0, value: 'all' })
  return arr
})
```
