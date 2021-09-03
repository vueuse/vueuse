---
category: Utilities
---

# toReactive

Converts ref to reactive. Also made possible to create a "swapable" reactive object.

## Usage

```ts
import { toReactive } from '@vueuse/core'

const refState = ref({ foo: 'bar' })

console.log(refState.value.foo) // => 'bar'

const state = toReactive(refState) // <--

console.log(state.foo) // => 'bar'

refState.value = { bar: 'foo' }

console.log(state.foo) // => undefined
console.log(state.bar) // => 'foo'
```
