---
category: Utilities
---

# useToggle

A boolean switcher with utility functions.

## Usage

```ts
import { useToggle } from '@vueuse/core'
import { shallowRef } from 'vue'

const [value, toggle] = useToggle()

// or destructure the return value
const { value, toggle } = useToggle()

// or with initial value
const [value, toggle] = useToggle(true)

// or with custom true/false values
const status = shallowRef('ON')
const toggle = useToggle(status, {
  truthyValue: 'ON',
  falsyValue: 'OFF',
})
```

When you pass a ref, `useToggle` will return a simple toggle function instead:

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

Note: be aware that the toggle function accepts the first argument as the override value. You might want to avoid directly passing the function to events in the template, as the event object will pass in.

```html
<!-- caution: $event will be pass in -->
<button @click="toggleDark" />
<!-- recommended to do this -->
<button @click="toggleDark()" />
```
