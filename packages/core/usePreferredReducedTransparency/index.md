---
category: Browser
---

# usePreferredReducedTransparency

Reactive [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency) media query.

## Usage

```js
import { usePreferredReducedTransparency } from '@vueuse/core'

const preferredTransparency = usePreferredReducedTransparency()
```

## Component Usage

```vue
<template>
  <UsePreferredReducedTransparency v-slot="{ transparency }">
    Preferred Reduced transparency: {{ transparency }}
  </UsePreferredReducedTransparency>
</template>
```
