---
category: Component
---

# useMounted

Mounted state in ref.

## Usage

```ts
import { useMounted } from '@vueuse/core'

const isMounted = useMounted()
```

Which is essentially a shorthand of:

```ts
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
```

## With Target Parameter

You can also monitor a specific component or element's mount state by passing a target:

```vue
<script setup>
import { useMounted } from '@vueuse/core'
import { ref } from 'vue'

const el = ref()
const isTargetMounted = useMounted(el)

const show = ref(true)
const el = ref()
const isTargetMounted = useMounted(el)
</script>

<template>
  <div>
    <button @click="show.value = !show.value">
      Toggle Element
    </button>
    <div v-if="show.value" ref="el">
      Target Element
    </div>
    <p>Target is {{ isTargetMounted ? 'mounted' : 'unmounted' }}</p>
  </div>
</template>

When using the target parameter, the returned ref will be `true` when the target element exists in the DOM, and `false` when it doesn't exist (e.g., when it's conditionally rendered with `v-if`).
```
