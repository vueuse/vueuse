---
category: Animation
---

# useCountDown

Countdown controller.

## Usage

```html
<template>
    <p>{{ formatted }}</p>
</template>

<script setup lang="ts">
    import { timestamp, useCountDown } from '@vueuse/core'
    const t = timestamp() + 30000
    const { formatted } = useCountDown(t)
</script>
```

## Component

```html
<count-down v-slot="{formatted}" :date="t">
    <p>{{ formatted }}</p>
</count-down>
```
