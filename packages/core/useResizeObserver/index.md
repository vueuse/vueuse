# useResizeObserver

> Reports changes to the dimensions of an Element's content or the border-box

## Usage

```tsx
import { ref } from '@vue/composition-api';
import { useResizeObserver } from '@vueuse/core'

export default defineComponent({
  setup() {
    const el = ref(null)
    const text = ref('')

    useResizeObserver(el, (entries) => {
      const entry = entries[0]
      const { width, height } =  entry.contentRect
      text.value = `width: ${width}, height: ${height}`
    })

    return {
      el,
      text,
    }
  },

  render() {
    const {
      text,
    } = this

    return (
      <div ref="el">
        {text}
      </div>
    )
  }
})
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
