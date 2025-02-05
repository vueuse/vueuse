---
category: Browser
---

# usePreferredDark

Reactive dark theme preference.

## Usage

```ts
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
