---
category: Utilities
---

# useCloned

Reactive clone of a ref. By default, it use `JSON.parse(JSON.stringify())` to do the clone.

## Usage

```ts
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })

const { cloned } = useCloned(original)

original.key = 'some new value'

console.log(cloned.value.key) // 'some new value'
```

## Manual cloning

```ts
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })

const { cloned, sync } = useCloned(original, { manual: true })

original.key = 'manual'

console.log(cloned.value.key) // 'value'

sync()

console.log(cloned.value.key)// 'manual'
```

## Custom Clone Function

Using [`klona`](https://www.npmjs.com/package/klona) for example:

```ts
import { useCloned } from '@vueuse/core'
import { klona } from 'klona'

const original = ref({ key: 'value' })

const { cloned, sync } = useCloned(original, { clone: klona })
```
