---
category: Reactivity
---

# reactiveComputed

Computed reactive object. Instead of returning a ref that `computed` does, `reactiveComputed` returns a reactive object.

<RequiresProxy />

## Usage

```ts
import { reactiveComputed } from '@vueuse/core'

const state = reactiveComputed(() => {
  return {
    foo: 'bar',
    bar: 'baz',
  }
})

state.bar // 'baz'
```
