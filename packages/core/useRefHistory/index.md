---
category: State
related: useManualRefHistory
---

# useRefHistory

Track the change history of a ref, also provides undo and redo functionality

<CourseLink href="https://vueschool.io/lessons/ref-history-with-vueuse?friend=vueuse">Learn useRefHistory with this FREE video lesson from Vue School!</CourseLink>

## Usage

```ts {5}
import { ref } from 'vue'
import { useRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo } = useRefHistory(counter)
```

Internally, `watch` is used to trigger a history point when the ref value is modified. This means that history points are triggered asynchronously batching modifications in the same "tick".

```ts
counter.value += 1

await nextTick()
console.log(history.value)
/* [
  { snapshot: 1, timestamp: 1601912898062 },
  { snapshot: 0, timestamp: 1601912898061 }
] */
```

You can use `undo` to reset the ref value to the last history point.

```ts
console.log(counter.value) // 1
undo()
console.log(counter.value) // 0
```

### Objects / arrays

When working with objects or arrays, since changing their attributes does not change the reference, it will not trigger the committing. To track attribute changes, you would need to pass `deep: true`. It will create clones for each history record.

```ts
const state = ref({
  foo: 1,
  bar: 'bar',
})

const { history, undo, redo } = useRefHistory(state, {
  deep: true,
})

state.value.foo = 2

await nextTick()
console.log(history.value)
/* [
  { snapshot: { foo: 2, bar: 'bar' } },
  { snapshot: { foo: 1, bar: 'bar' } }
] */
```

#### Custom Clone Function

`useRefHistory` only embeds the minimal clone function `x => JSON.parse(JSON.stringify(x))`. To use a full featured or custom clone function, you can set up via the `dump` options.

For example, using [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone):

```ts
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, { dump: structuredClone })
```

Or by using [lodash's `cloneDeep`](https://lodash.com/docs/4.17.15#cloneDeep):

```ts
import { cloneDeep } from 'lodash-es'
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, { dump: cloneDeep })
```

Or a more lightweight [`klona`](https://github.com/lukeed/klona):

```ts
import { klona } from 'klona'
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, { dump: klona })
```

#### Custom Dump and Parse Function

Instead of using the `clone` param, you can pass custom functions to control the serialization and parsing. In case you do not need history values to be objects, this can save an extra clone when undoing. It is also useful in case you want to have the snapshots already stringified to be saved to local storage for example.

```ts
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, {
  dump: JSON.stringify,
  parse: JSON.parse,
})
```

### History Capacity

We will keep all the history by default (unlimited) until you explicitly clear them up, you can set the maximal amount of history to be kept by `capacity` options.

```ts
const refHistory = useRefHistory(target, {
  capacity: 15, // limit to 15 history records
})

refHistory.clear() // explicitly clear all the history
```

### History Flush Timing

From [Vue's documentation](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing): Vue's reactivity system buffers invalidated effects and flush them asynchronously to avoid unnecessary duplicate invocation when there are many state mutations happening in the same "tick".

In the same way as `watch`, you can modify the flush timing using the `flush` option.

```ts
const refHistory = useRefHistory(target, {
  flush: 'sync', // options 'pre' (default), 'post' and 'sync'
})
```

The default is `'pre'`, to align this composable with the default for Vue's watchers. This also helps to avoid common issues, like several history points generated as part of a multi-step update to a ref value that can break invariants of the app state. You can use `commit()` in case you need to create multiple history points in the same "tick"

```ts
const r = ref(0)
const { history, commit } = useRefHistory(r)

r.value = 1
commit()

r.value = 2
commit()

console.log(history.value)
/* [
  { snapshot: 2 },
  { snapshot: 1 },
  { snapshot: 0 },
] */
```

On the other hand, when using flush `'sync'`, you can use `batch(fn)` to generate a single history point for several sync operations

```ts
const r = ref({ names: [], version: 1 })
const { history, batch } = useRefHistory(r, { flush: 'sync' })

batch(() => {
  r.names.push('Lena')
  r.version++
})

console.log(history.value)
/* [
  { snapshot: { names: [ 'Lena' ], version: 2 },
  { snapshot: { names: [], version: 1 },
] */
```

If `{ flush: 'sync', deep: true }` is used, `batch` is also useful when doing a mutable `splice` in an array. `splice` can generate up to three atomic operations that will be pushed to the ref history.

```ts
const arr = ref([1, 2, 3])
const { history, batch } = useRefHistory(r, { deep: true, flush: 'sync' })

batch(() => {
  arr.value.splice(1, 1) // batch ensures only one history point is generated
})
```

Another option is to avoid mutating the original ref value using `arr.value = [...arr.value].splice(1,1)`.

## Recommended Readings

- [History and Persistence](https://patak.dev/vue/history-and-persistence.html) - by [@matias-capeletto](https://github.com/matias-capeletto)
