---
category: Utilities
---

# useToggle

A boolean switcher with utility functions.

## Usage

```js
import { useToggle } from '@vueuse/core'

const [value, toggle, setTruthy, setFalsy] = useToggle()
```

When you pass a ref, `useToggle` will return a simple toggle function instead:

```js
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

You also can provide options to customize your value. 
```js
import { useToggle } from '@vueuse/core'

const options = {
  truthyValue: 'on',
  falsyValue: 'off',
}

const [status, toggle, setTruthy, setFalsy] = useToggle(options.falsyValue, options)
```
