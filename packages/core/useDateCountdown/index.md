---
category: Animation
---

# useDateCountdown

Date countdown controller.

## Usage

```html
<template>
  <div>
    <p v-if="isActive">
      Remaining today :  <em class="text-red-400">{{ formatted }}</em>
    </p>
    <p v-else>
      Countdown paused !
    </p>
    <button opacity="75" @click="toggle">
      {{ isActive ? 'Pause' : 'Start' }}
    </button>
  </div>
</template>

<script setup lang="ts">
    import { useDateCountdown } from '@vueuse/core'
    // Remaining today
    const t = new Date( 
        new Date(new Date().toLocaleDateString()).getTime()
                + 24 * 60 * 60 * 1000
                - 1,
    )
    const { formatted, controls: { isActive, pause, resume } } = useDateCountdown(t, { format: 'HH:mm:ss:SSS', interval: 'requestAnimationFrame' })
</script>
```


