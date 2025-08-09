---
category: Sensors
---

# usePageLeave

Reactive state to show whether the mouse leaves the page.

## Usage

```ts
import { usePageLeave } from '@vueuse/core'

const isLeft = usePageLeave()
```

## Component Usage

```vue
<template>
  <UsePageLeave v-slot="{ isLeft }">
    Has Left Page: {{ isLeft }}
  </UsePageLeave>
</template>
```
