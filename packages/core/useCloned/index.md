---
category: Utilities
---

# useCloned

Reactive clone of a ref.

## Usage
```ts
import { useCloned } from '@vueuse/core/useCloned'

const originData = ref({
  key: 'value'
})

const { cloned } = useCloned(originData)

originData.key = 'some new value'

console.log(cloned.value.key) // 'some new value'

```

## Manual cloning
```ts
import { useCloned } from '@vueuse/core/useCloned'

const data = ref({
  key: 'value'
})

const { cloned, sync } = useCloned(data, { manual: true })

data.key = 'manual'

console.log(cloned.value.key) // 'value'

sync()

console.log(cloned.value.key)// 'manual'
```

## Custom clone function usage
```ts
import { useCloned } from '@vueuse/core/useCloned'

const data = ref({
  key: 'value'
})

const { cloned, sync } = useCloned(data, {
  cloneFunction: (source, cloned) => ({ ...source, isCloned: true })
})

data.value.key = 'clone it'

console.log(cloned.value.isCloned) // true
console.log(cloned.value.key) // 'clone it'
```
