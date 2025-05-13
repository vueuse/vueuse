---
category: Watch
---

# watchOnce

`watch` that only triggers once.

::: tip

[Once Watcher](https://vuejs.org/guide/essentials/watchers.html#once-watchers) has been added to Vue [since 3.4](https://github.com/vuejs/core/pull/9034), use `watch(watchSource, callback, { once: true })` instead on supported versions.

:::

## Usage

After the callback function has been triggered once, the watch will be stopped automatically.

```ts
import { watchOnce } from '@vueuse/core'

watchOnce(source, () => {
  // triggers only once
  console.log('source changed!')
})
```
