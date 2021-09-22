---
category: Elements
---

# useIntersectionObserver

Detects that a target element's visibility.

## Usage

```html
<div ref="target">
  <h1>Hello world</h1>
</div>
```

```js
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)
    const targetIsVisible = ref(false)

    const { stop } = useIntersectionObserver(
      target,
      ([{ isIntersecting }], observerElement) => {
        targetIsVisible.value = isIntersecting
      },
    )

    return {
      target,
      targetIsVisible,
    }
  },
}
```

[IntersectionObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)
