---
category: Elements
---

# useWindowSize

Reactive window size

## Usage

```js
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
```

## Component

```html
<UseWindowSize v-slot="{ width, height }">
  Width: {{ width }}
  Height: {{ height }}
</UseWindowSize>
```
