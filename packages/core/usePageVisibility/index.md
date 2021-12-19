---
category: Sensors
---

# usePageVisibility

Reactive page visibility state.

## Usage

```ts
import { usePageVisibility } from '@vueuse/core'

const { isVisible, visibilityState } = usePageVisibility()

watch(isVisible, () => {
  // Do something when the page is no longer visible, e.g., pause videos etc
})
```