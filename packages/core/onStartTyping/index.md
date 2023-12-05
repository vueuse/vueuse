---
category: Sensors
---

# onStartTyping

Fires when users start typing on non-editable elements.

## Usage

```vue
<input ref="input" type="text" placeholder="Start typing to focus" />
```

```ts {7-10}
import { onStartTyping } from '@vueuse/core'

export default {
  setup() {
    const input = ref(null)

    onStartTyping(() => {
      if (!input.value.active)
        input.value.focus()
    })

    return {
      input,
    }
  },
}
```
