# onStartTyping

> Fires when users start typing on non-editable elements.

## Usage

```html
<input ref="input" type="text" placeholder="Start typing to focus" />
```

```ts
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
