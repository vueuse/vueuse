---
category: Browser
---

# usePreferredDark

Reactive dark theme preference.

## Usage

```js
import { usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
```

## Component Usage

```vue
<template>
  <UsePreferredDark v-slot="{ prefersDark }">
    Prefers Dark: {{ prefersDark }}
  </UsePreferredDark>
</template>
```
