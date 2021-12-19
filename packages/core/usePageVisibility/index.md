---
category: Sensors
---

# usePageVisibility

Reactive page visibility state.

## Usage

```ts
import { defineComponent, ref } from 'vue'
import { usePageVisibility } from '@vueuse/core'

export default defineComponent({
  setup() {
    const { isVisible, isHidden, visibilityState } = usePageVisibility()

    watch(isVisible, () => {
      // Do something when the page becomes visible, e.g., resume playing videos etc
    })

    watch(isHidden, () => {
      // Do something when the page is no longer visible, e.g., pause videos etc
    })

    return {
      visibilityState
    }
  }
})
```