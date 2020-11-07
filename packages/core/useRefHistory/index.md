# useRefHistory

> Track the change history of a ref, also provide undo and redo functionality

## Usage

```ts {5}
import { ref } from 'vue' 
import { useRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo } = useRefHistory(counter)

counter.value += 1
counter.value = 10

console.log(history.value) // [{ value: 10, timestamp: 1601912898062 }, { value: 1, timestamp: 1601912898061 }]

console.log(counter.value) // 10
undo()
console.log(counter.value) // 1 
```

### Objects / arrays

When working with objects or arrays, since changing their attributes does not change the reference, it will not trigger the committing. To track attribute changes, you would need to pass `deep: true`. It will create clones for each history record.

```ts
const state = ref({
  foo: 1,
  bar: 'bar'
})

const { history, undo, redo } = useRefHistory(state, {
  deep: true,
})

state.value.foo = 2

console.log(history.value) 
/* [
  { value: { foo: 2, bar: 'bar' } },
  { value: { foo: 1, bar: 'bar' } }
] */
```

#### Custom Clone Function

`useRefHistory` only embeds the minimal clone function `x => JSON.parse(JSON.stringify(x))`. To use a full featured or custom clone function, you can set up via the `dump` options.

For example, using [lodash's `cloneDeep`](https://lodash.com/docs/4.17.15#cloneDeep):

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


### History Capacity

We will keep all the history by default (unlimited) until you explicitly clean them up, you can set the maximal amount of history to be kept by `capacity` options.

```ts
const refHistory = useRefHistory(target, {
  capacity: 15 // limit to 15 history records
})

refHistory.clean() // explicitly clean all the history
```
