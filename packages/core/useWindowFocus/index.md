---
category: Elements
---

# useWindowFocus

Reactively track window focus with `window.onfocus` and `window.onblur` events.

## Usage

```js
import { useWindowFocus } from '@vueuse/core'

const focused = useWindowFocus()
```

## Component Usage
```html
<UseWindowFocus v-slot="{ focused }">
  Document Focus: {{ focused }}
</UseWindowFocus>
```
