---
category: Reactivity
related: syncRef
---

# syncRefs

Keep target refs in sync with a source ref

## Usage

```ts
import { syncRefs } from '@vueuse/core'

const source = ref('hello')
const target = ref('target')

const stop = syncRefs(source, target)

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // foo
```

## Watch options

The options for `syncRefs` are similar to `watch`'s `WatchOptions` but with different default values.

```ts
export interface SyncRefOptions {
  /**
   * Timing for syncing, same as watch's flush option
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush']
  /**
   * Watch deeply
   *
   * @default false
   */
  deep?: boolean
  /**
   * Sync values immediately
   *
   * @default true
   */
  immediate?: boolean
}
```

When setting `{ flush: 'pre' }`, the target reference will be updated at [the end of the current "tick"](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing) before rendering starts.

```ts
import { syncRefs } from '@vueuse/core'

const source = ref('hello')
const target = ref('target')

syncRefs(source, target, { flush: 'pre' })

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // hello <- still unchanged, because of flush 'pre'

await nextTick()

console.log(target.value) // foo <- changed!
```
