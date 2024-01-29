---
category: Component
---

# useCurrentElement

Get the DOM element of current component as a ref.

## Usage

```ts
import { useCurrentElement } from '@vueuse/core'

const el = useCurrentElement() // ComputedRef<Element>
```

Or pass a specific root vue component

```vue
<script>
import { ref } from 'vue'
import { useCurrentElement } from '@vueuse/core'

export default {
  setup() {
    const rootComponentRef = ref()

    const el = useCurrentElement(rootComponentRef) // ComputedRef<Element>
    // use el any way you want

    return {
      rootComponentRef,
      /* ... */
    }
  },
}
</script>

<template>
  <div>
    <OtherVueComponent ref="rootComponentRef" />

    <p>Hello world</p>
  </div>
</template>
```

## Caveats

This functions uses [`$el` under the hood](https://vuejs.org/api/component-instance.html#el).

Value of the ref will be `undefined` until the component is mounted.

- For components with a single root element, it will point to that element.
- For components with text root, it will point to the text node.
- For components with multiple root nodes, it will be the placeholder DOM node that Vue uses to keep track of the component's position in the DOM.

It's recommend to only use this function for components with **a single root element**.
