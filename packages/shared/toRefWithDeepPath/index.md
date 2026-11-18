---
category: Reactivity
---

# toRefWithDeepPath

Writable ref synced with a nested property of a reactive source.

Vue's [`toRef(object, key)`](https://vuejs.org/api/reactivity-utilities.html#toref) stops at one key. A writable computed goes further, but the path is written twice and is not checked. `toRefWithDeepPath` writes the path once, as a tuple, and keeps the ref writable.

```ts
import { toRefWithDeepPath } from '@vueuse/core'
import { reactive, ref } from 'vue'

const user = reactive({
  infos: {
    fName: 'John',
  },
})

const fName = toRefWithDeepPath(user, ['infos', 'fName'])

fName.value = 'Jane'
// user.infos.fName === 'Jane'

user.infos = { fName: 'Ada' }
// fName.value === 'Ada'

const state = ref({ count: 0 })
const count = toRefWithDeepPath(state, ['count'])

count.value++
// state.value.count === 1
```

The source is a reactive object, a `ref`, or a getter that returns one. Replacing an intermediate object keeps the ref on the same path.

## Behavior

- The path is a tuple of up to 6 keys. An array literal at the call site is checked. A widened `string[]` is not.
- Reading through a missing segment, or through `null`, returns `undefined`. The read does not create objects.
- Writing through a missing segment creates an object, or an array when the next key is a number.
- Writing through `null`, or through a primitive, throws. The source is left unchanged.
- A plain object or a `shallowRef` has nothing for the computed to track past the root, so later nested edits are not picked up. Pass `reactive()` or `ref()`.

This is not an overload of VueUse's [`toRef`](https://vueuse.org/shared/toRef/), which normalizes a value, a ref, or a getter.
