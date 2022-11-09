---
category: Reactivity
alias: asyncComputed
---

# computedAsync

Computed for async functions

## Usage

```js
import { ref } from 'vue'
import { computedAsync } from '@vueuse/core'

const name = ref('jack')

const userInfo = computedAsync(
  async () => {
    return await mockLookUp(name.value)
  },
  null, // initial state
)
```

### Evaluation State

You will need to pass a ref to track if the async function is evaluating.

```js
import { ref } from 'vue'
import { computedAsync } from '@vueuse/core'

const evaluating = ref(false)

const userInfo = computedAsync(
  async () => { /* your logic */ },
  null,
  evaluating,
)
```

### onCancel

When the computed source changed before the previous async function gets resolved, you may want to cancel the previous one. Here is an example showing how to incorporate with the fetch API.

```js
const packageName = ref('@vueuse/core')

const downloads = computedAsync(async (onCancel) => {
  const abortController = new AbortController()

  onCancel(() => abortController.abort())

  return await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${packageName.value}`,
    { signal: abortController.signal },
  )
    .then(response => response.ok ? response.json() : { downloads: '—' })
    .then(result => result.downloads)
}, 0)
```

### Lazy

By default, `computedAsync` will start resolving immediately on creation, specify `lazy: true` to make it start resolving on the first accessing.

```js
import { ref } from 'vue'
import { computedAsync } from '@vueuse/core'

const evaluating = ref(false)

const userInfo = computedAsync(
  async () => { /* your logic */ },
  null,
  { lazy: true, evaluating },
)
```

## Caveats

- Just like Vue's built-in `computed` function, `computedAsync` does dependency tracking and is automatically re-evaluated when dependencies change. Note however that only dependency referenced in the first call stack are considered for this. In other words: **Dependencies that are accessed asynchronously will not trigger re-evaluation of the async computed value.**

- As opposed to Vue's built-in `computed` function, re-evaluation of the async computed value is triggered whenever dependencies are changing, regardless of whether its result is currently being tracked or not.
