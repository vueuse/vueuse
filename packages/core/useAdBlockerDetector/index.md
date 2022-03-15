---
category: Sensors
---

# useAdBlockerDetector

Detect if the use has or has not an Ad blocker.

## Usage
### As an async component
```vue
<!-- Content.vue -->
<script setup>
import { useAdBlockerDetector } from '@vueuse/core'

const hasBlockerDetector = await useAdBlockerDetector()
</script>

<template>
  <p>
    Your browser {{ hasBlockerDetector ? 'has' : 'doesn\'t have' }} an activated Ad Blocker
  </p>
</template>
```
```vue
<!-- App.vue -->
<script setup>
import Content from './Content.vue'
</script>

<template>
  <Suspense>
    <Content />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
```

### As a non async component
```vue
<script>
import { ref } from 'vue'
import { useAdBlockerDetector } from '@vueuse/core'

const hasBlockerDetector = ref(false)
useAdBlockerDetector().then(abd => hasBlockerDetector.value = abd.value)
</script>

<template>
  <p>
    Your browser {{ hasBlockerDetector ? 'has' : 'doesn\'t have' }} an activated Ad Blocker
  </p>
</template>
```
