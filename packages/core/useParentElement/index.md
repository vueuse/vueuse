---
category: Elements
---

# useParentElement

Get parent element of the given element

## Usage

When no argument is passed, it will return the parent element of the current component.

```js
import { useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

onMounted(() => {
  console.log(parentEl.value)
})
```

It can also accept a `ref` as the first argument.

```ts
import { useParentElement } from '@vueuse/core'

// Don't forget to bind the ref to the element
const tooltip = ref<HTMLElement | undefined>()

const tooltipWrapper = useParentElement(tooltip)

onMounted(() => {
  console.log(tooltipWrapper.value)
})
```
