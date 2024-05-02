---
category: Watch
---

# watchOnce

`watch` that only triggers once.

## Usage

After the callback function has been triggered once, the watch will be stopped automatically.

```ts
import { watchOnce } from '@vueuse/core'

watchOnce(source, () => {
  // triggers only once
  console.log('source changed!')
})
```

### Options: `until`

The option allows keeping the watcher until certain condition is met, then run the callback once and stop the watcher automatically.

```ts
import { getCurrentInstance } from 'vue'
import { useElementVisibility, watchOnce } from '@vueuse/core'

const instance = getCurrentInstance()

watchOnce(
  [
    // Check whether the element is within the viewport.
    useElementVisibility(instance.proxy),
    // Check whether the element is not visually hidden.
    () => !!instance.vnode.el?.offsetParent,
  ],
  () => {
    // Triggers only once.
    console.log('The component is in the viewport and visible')
  },
  {
    immediate: true,
    until: ([isInViewport, isVisible]) => isInViewport && isVisible,
  },
)
```
