# useElementVisibility

> Tracks the visibility of an element within the viewport.

## Usage

```tsx
import { useElementVisibility } from '@vueuse/core'

export default {
  setup() {
    const {
      element: container,
      elementIsVisible: containerIsVisible,
    } = useElementVisibility();

    return {
      container,
      containerIsVisible,
    }
  },
  render() {
    return (
      <div ref="container">
        <h1>Hello world</h1>
      </div>
    )
  }
}
```
