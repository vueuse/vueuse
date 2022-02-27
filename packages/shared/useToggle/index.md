---
category: Utilities
---

# useToggle

A boolean switcher with utility functions.

## Usage

```js
import { useToggle } from '@vueuse/shared'

const [value, toggle] = useToggle()
```

When you pass a ref, `useToggle` will return a simple toggle function instead:

```js
import { useDark } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```
