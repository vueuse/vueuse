---
category: Browser
---

# usePreferredReducedMotion

Reactive [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media query.

## Usage

```js
import { usePreferredReducedMotion } from '@vueuse/core'

const preferredMotion = usePreferredReducedMotion()
```

## Component Usage

```html
<UsePreferredReducedMotion v-slot="{ motion }">
  Preferred Reduced Motion: {{ motion }}
</UsePreferredReducedMotion>
```
