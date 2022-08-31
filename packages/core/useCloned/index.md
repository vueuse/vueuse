---
category: Utilities
---

# useCloned

Reactive clone of a ref.

## Usage
```ts
import { useCloned } from '@vueuse/core'

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
