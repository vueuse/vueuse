---
category: Utilities
---

# useToggle

A boolean switcher with utility functions.

## Usage

```js
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
```

When you pass a ref, `useToggle` will return a simple toggle function instead:

```js
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

Note: do not directly bind the toggle method as a button's click handler.
Make sure to use a dynamic expression instead as shown in the demo, as the
browser will pass the click handler a click event as an argument to your
toggle method. This will cause the value of the toggle to always be truthy.
