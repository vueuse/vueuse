---
category: Watch
---

# pausableWatch

Pausable watch

## Usage

Use as normal the `watch`, but return extra `pause()` and `resume()` functions to control.

```ts
import { pausableWatch } from '@vueuse/core'
import { ref, nextTick } from 'vue'

const source = ref('foo')

const { stop, pause, resume } = pausableWatch(
  source,
  (v) => console.log(`Changed to ${v}!`),
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
