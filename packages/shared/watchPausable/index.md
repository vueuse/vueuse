---
category: Watch
alias: pausableWatch
---

# watchPausable

Pausable watch

::: tip

Unlike Vue's built-in `watch().pause()` / `resume()`, `watchPausable` ignores source changes while paused and does not run the callback just because it is resumed.

:::

## Usage

Use as normal the `watch`, but return extra `pause()` and `resume()` functions to control.

```ts
import { watchPausable } from '@vueuse/core'
import { nextTick, shallowRef } from 'vue'

const source = shallowRef('foo')

const { stop, pause, resume } = watchPausable(
  source,
  v => console.log(`Changed to ${v}!`),
)

source.value = 'bar'
await nextTick() // Changed to bar!

pause()

source.value = 'foobar'
await nextTick() // (nothing happend)

resume()

source.value = 'hello'
await nextTick() // Changed to hello!
```
