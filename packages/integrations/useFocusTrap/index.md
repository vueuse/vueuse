---
category: '@Integrations'
---

# useFocusTrap

Reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap).

For more information on what options can be passed, see [`createOptions`](https://github.com/focus-trap/focus-trap#createfocustrapelement-createoptions) in the `focus-trap` documentation.

## Install 

```bash
npm i focus-trap
```

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

**Conditional Rendering**

This function can't properly activate focus on elements with conditional rendering using `v-if`. This is because they do not exist in the DOM at the time of the focus activation. To solve this you need to activate on the next tick.

```html
<script setup>
import { nextTick, ref } from 'vue'

const target = ref()
const { activate, deactivate } = useFocusTrap(target, { immediate: true })

const show = ref(false)  

const reveal = async () => {
  show.value = true
  
  await nextTick()
  activate()
}
</script>

<template>
  <div>
    <div ref="target" v-if="show">...</div>
    
    <button @click="reveal">Reveal and Focus</button>
  </div>
</template>
```

## Using Component

With the `UseFocusTrap` component, Focus Trap will be activated automatically on mounting this component and deactivated on unmount.

```html
<script setup>
import { ref } from 'vue'
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'

const show = ref(false)
</script>

<template>
  <UseFocusTrap v-if="show" :options="{ immediate: true }">
    <div class="modal">...</div>
  </UseFocusTrap>
</template>

```
