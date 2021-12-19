---
category: Sensors
---

# usePageVisibility

Reactive page visibility state.

## Usage

```ts
import { usePageVisibility } from '@vueuse/core'

const { isVisible, isHidden, visibilityState } = usePageVisibility()

watch(isVisible, () => {
  // Do something when the page becomes visible, e.g., resume playing videos etc
})

watch(isHidden, () => {
  // Do something when the page is no longer visible, e.g., pause videos etc
})
```