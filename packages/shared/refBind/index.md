---
category: Reactivity
alias: bindRef
---

# refBind

One-way bind for ref.

## Usage

```ts
import { refBind } from '@vueuse/core'

const a = ref('a')
const b = refBind(a)

console.log(a.value) // a

console.log(b.value) // a

b.value = 'foo'

console.log(a.value) // a

console.log(b.value) // foo

a.value = 'bar'

console.log(a.value) // bar

console.log(b.value) // bar
```

When using with `props`, auto reset ref value when props changes.

```diff {9}
const props = defineProps<{
  n: number
}>()

- const start = ref(props.n)
- watch(() => props.n, () => {
-   start.value = props.n
- })
+ const start = refBind(() => props.n)
```

### Custom watcher

```ts
import { refBind } from '@vueuse/core'

const a = ref(0)
const b = computed(() => a.value > 5)
const c = refBind(a, b) // set c to a when a greater than 5
```

Reset value when custom watcher trigger

```ts
import { refBind } from '@vueuse/core'

const a = ref(0)
const b = refBind(1, a) // reset b to 1 when a changes
```
