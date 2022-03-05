---
category: Sensors
---

# usePageLeave

Reactive state to show whether the mouse leaves the page.

## Usage

```js
import { usePageLeave } from '@vueuse/core'

const isLeft = usePageLeave()
```

## Component Usage
```html
<UsePageLeave v-slot="{ isLeft }">
  Has Left Page: {{ isLeft }}
</UsePageLeave>
```
