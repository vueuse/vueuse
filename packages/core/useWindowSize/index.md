---
category: Elements
---

# useWindowSize

Reactive window size

## Usage

```vue
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <div>
    Width: {{ width }}
    Height: {{ height }}
  </div>
</template>
```

### Initial values

Before the window is measured (e.g. during SSR), `width` and `height` are `Infinity`. Set your own initial values with `initials`:

```ts
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize({
  initials: { width: 1280, height: 720 },
})
```

The returned refs are readonly. To own the state, pass your own refs to `initials`; `useWindowSize` writes into them.

## Component Usage

```vue
<template>
  <UseWindowSize v-slot="{ width, height }">
    Width: {{ width }}
    Height: {{ height }}
  </UseWindowSize>
</template>
```
