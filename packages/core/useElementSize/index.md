# useElementSize

> Reactive size of an HTML element. (simple version of `useResizeObserver`)

## Usage

```html
<template>
  <div ref="el">
    Height: {{ height }}
    Width: {{ Width }}
  </div>
</template>

<script>
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const { width, height } = useElementSize(el)

    return {
      el,
      width,
      height,
    }
  }
})
</script>
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
