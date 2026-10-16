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

::: warning
`useBrowserLocation` only updates on the `popstate` and `hashchange` events. The browser fires neither when the URL is changed with `history.pushState()` or `history.replaceState()`, which is how `useUrlSearchParams` and most client-side routers update it. Such changes show up after the next `popstate`, `hashchange` or page load. To react to query changes made through `useUrlSearchParams`, read the reactive object it returns instead.
:::

## Component Usage

```vue
<UseBrowserLocation v-slot="location">
  Browser Location: {{ location }}
</UseBrowserLocation>
```
