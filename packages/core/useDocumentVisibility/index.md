---
category: Elements
---

# useDocumentVisibility

Reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)

## Usage

```js
import { useDocumentVisibility } from '@vueuse/core'

const visibility = useDocumentVisibility()
```

## Component Usage
```html
<UseDocumentVisibility v-slot="{ visibility }">
  Document Visibility: {{ visibility }}
</UseDocumentVisibility>
```
