---
category: Sensors
---

# useWindowFocus

Reactively track window focus with `window.onfocus` and `window.onblur` events.

## Usage

```js
import { useWindowFocus } from '@vueuse/core'

const focused = useWindowFocus()
```

## Component
```html
<UseWindowFocus v-slot="{ focused }">
  Document Focus: {{ focused }}
</UseWindowFocus>
```
