# useIntersectionObserver

> Detects that a target element's visibility.

## Usage

```tsx
import { ref } from '@vue/composition-api';
import { useIntersectionObserver } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null);
    const targetIsVisible = ref(false);

    useIntersectionObserver({
      target: ref,
      onIntersect: ([{ isIntersecting }], observerElement) => {
        targetIsVisible.value = isIntersecting
      },
    });

    return {
      target,
      targetIsVisible,
    }
  },
  render() {
    return (
      <div ref="target">
        <h1>Hello world</h1>
      </div>
    )
  }
}
```
