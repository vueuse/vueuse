---
category: Browser
---

# useBrowserLocation

Reactive browser location

> NOTE: If you're using Vue Router, use [`useRoute`](https://router.vuejs.org/guide/advanced/composition-api.html) provided by Vue Router instead.

## Usage

```ts
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
```

## Component Usage

```vue
<UseBrowserLocation v-slot="location">
  Browser Location: {{ location }}
</UseBrowserLocation>
```
