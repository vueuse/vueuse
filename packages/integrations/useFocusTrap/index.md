---
category: '@Integrations'
---

# useFocusTrap

Reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap)

For more info on what options can be passed see [`createOptions`](https://github.com/focus-trap/focus-trap#createfocustrapelement-createoptions) in the `focus-trap` docs.

## Usage

**Basic Usage**

```html
<script setup>
import { ref } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const target = ref()
const { hasFocus, activate, deactivate } = useFocusTrap(target)
</script>

<template>
  <div>
    <button @click="activate()">Activate</button>
    <div ref="target">
      <span>Has Focus: {{ hasFocus }}</span>
      <input type="text" />
      <button @click="deactivate()">Deactivate</button>
    </div>
  </div>
</template>
```

**Automatically Focus**

```html
<script setup>
import { ref } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const target = ref()
const { hasFocus, activate, deactivate } = useFocusTrap(target, { immediate: true })
</script>

<template>
  <div>
    <div ref="target">...</div>
  </div>
</template>
```
