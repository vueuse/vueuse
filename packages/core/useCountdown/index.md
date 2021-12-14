---
category: Animation
---

# useCountdown

Countdown controller.

## Usage

```html
<template>
    <p>{{ formatted }}</p>
</template>

<script setup lang="ts">
    import { timestamp, useCountdown } from '@vueuse/core'
    const t = timestamp() + 30000
    const { formatted } = useCountdown(t)
</script>
```

## Component

```html
<count-down v-slot="{formatted}" :date="t">
    <p>{{ formatted }}</p>
</count-down>
```
