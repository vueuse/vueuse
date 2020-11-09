# syncRef

> Keep target refs in sync with a source ref

## Usage

```ts
import { syncRef } from '@vueuse/core'

const source = ref('hello')
const target = ref('target')

const stop = syncRef(source, target)

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // foo
```

## Watch options

You can pass a `WatchOptions` object to `syncRef` to configure it in the same way as you do with Vue `watch`.
The defaults are different from `watch` to align this composable with the way computed references work.
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
Example using `{ flush: 'pre' }` so the target reference is updated at the end of the current "tick" before rendering starts.

```ts
import { syncRef } from '@vueuse/core'

const source = ref('hello')
const target = ref('target')

const stop = syncRef(source, target, { flush: 'pre' })

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // hello <- still unchanged, because of flush 'pre'

await nextTick()

console.log(target.value) // foo <- changed!
```

## Related Functions

- [biSyncRef](https://vueuse.js.org/?path=/story/utilities--bisyncref)
