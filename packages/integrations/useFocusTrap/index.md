---
category: '@Integrations'
---

# useFocusTrap

Reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap).

For more information on what options can be passed, see [`createOptions`](https://github.com/focus-trap/focus-trap#createfocustrapelement-createoptions) in the `focus-trap` documentation.

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

## Using Component

This function can't properly activate focus on elements with conditional rendering. In this case, you can use the `UseFocusTrap` component. Focus Trap will be activated automatically on mounting this component and deactivated on unmount.

```html
<script setup>
import { ref } from 'vue'
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'

const show = ref(false)
</script>

<template>
  <UseFocusTrap v-if="show">
    <div class="modal">...</div>
  </UseFocusTrap>
</template>

```
