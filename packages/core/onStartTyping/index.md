# onStartTyping

> Fires when user starts typing on a non editable element.

## Usage

```jsx
import { onStartTyping } from '@vueuse/core'

const Demo = defineComponent({
  setup() {
    const input = ref(null)

    useOnStartTyping(() => {
      if (!input.value.active)
        input.value.focus()
    })

    return {
      input,
    }
  },
  render() {
    return (
      <div id="demo">
        <input ref="input" type="text" placeholder="Start typing to focus" />
        <input type="text" placeholder="Start typing has no effect here" />
      </div>
    )
  },
})
```
