---
category: Watch
alias: pausableWatch
---

# watchPausable

Pausable watch

::: tip

[Pausable Watcher](https://vuejs.org/api/reactivity-core.html#watch) has been added to Vue [since 3.5](https://github.com/vuejs/core/pull/9651), use `const { stop, pause, resume } = watch(watchSource, callback)` instead on supported versions.

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
