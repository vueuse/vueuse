---
category: Utilities
---

# useCloned

Reactive partial clone.

## Usage
```ts
import { useCloned } from '@vueuse/core/useCloned'

const originData = ref({
  key: 'value'
})

const { cloned, stop } = useCloned(originData)

originData.key = 'some new value'

console.log(cloned.value.key) // 'some new value'

stop()
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
