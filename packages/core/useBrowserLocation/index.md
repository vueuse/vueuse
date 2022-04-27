---
category: Browser
---

# useBrowserLocation

Reactive browser location

> When Vue Router installed use the [`useRoute`](https://router.vuejs.org/guide/advanced/composition-api.html) provided by Vue Router instead.

## Usage

```js
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
```

## Component Usage

```html
<UseBrowserLocation v-slot="{ location }">
  Browser Location: {{ location }}
</UseBrowserLocation>
```
