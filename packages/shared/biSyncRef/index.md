# biSyncRef

> Two-way refs synchronization.

## Usage

```ts
import { biSyncRef } from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = biSyncRef(a, b)

console.log(a.value) // hello

b.value = 'foo'

console.log(a.value) // foo

a.value = 'bar'

console.log(b.value) // bar
```

## Related Functions

- [syncRef](https://vueuse.js.org/?path=/story/utilities--syncref)
