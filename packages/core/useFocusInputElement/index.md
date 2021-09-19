---
category: Browser
---

# useFocusInputElement

Utility to track or set the focus state of a Form Input element. Use this when your UI library wraps the form element in layers of divs, precluding your ability to get a ref to the form element directly.

useFocusFormElement will behave the same as useFocus with the exception that it will search the supplied DOM element for a child of type 'select', 'input', or 'textarea' and use that DOM element to track or set focus on.

## Usage

```ts
import { useFocusInputElement } from '@vueuse/core'

const input = ref();
const inputFocused = useFocusInputElement({ target: input })
```
