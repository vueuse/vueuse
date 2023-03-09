---
category: Elements
---

# useParentElement

Get parent element of the given element

## Usage

```js
import { useParentElement } from '@vueuse/core'

const { parentEl } = useParentElement()

console.log('parentEl :>>', parentEl.value)
```

It can also accept a `ref` as the first argument.

```js
import { useParentElement } from '@vueuse/core'

// Don't forget to bind the ref to the element
const tooltip = ref()

const { parentEl: tooltipWrapper } = useParentElement(tooltip)

console.log('tooltipWrapper :>>', tooltipWrapper.value)
```
