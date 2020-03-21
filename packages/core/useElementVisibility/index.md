# useElementVisibility

> Tracks the visibility of an element within the viewport.

## Usage

```tsx
import { ref } from '@vue/composition-api';
import { useElementVisibility } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null);
    const targetIsVisible = useElementVisibility(target);

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
