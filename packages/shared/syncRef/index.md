---
category: Reactivity
related: syncRefs
---

# syncRef

Two-way refs synchronization.

## Usage

```ts
import { syncRef } from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = syncRef(a, b)

console.log(a.value) // a

b.value = 'foo'

console.log(a.value) // foo

a.value = 'bar'

console.log(b.value) // bar
```

### One directional

```ts
import { syncRef } from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = syncRef(a, b, { direction: 'rtl' })
```

### Custom Transform

```ts
import { syncRef } from '@vueuse/core'

const a = ref(10)
const b = ref(2)

const stop = syncRef(a, b, {
  transform: {
    ltr: left => left * 2,
    rtl: right => right / 2
  }
})

console.log(b.value) // 20

b.value = 30

console.log(a.value) // 15
```
