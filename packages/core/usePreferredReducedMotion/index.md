---
category: Browser
---

# usePreferredReducedMotion

Reactive [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media query.

## Usage

```ts
import { usePreferredReducedMotion } from '@vueuse/core'

const preferredMotion = usePreferredReducedMotion()
```

## Component Usage

```vue
<template>
  <UsePreferredReducedMotion v-slot="{ motion }">
    Preferred Reduced Motion: {{ motion }}
  </UsePreferredReducedMotion>
</template>
```
