---
category: Sensors
---

# onLongPress

Listen for a long press on an element.

## Usage

### As a hook

```html
<script setup lang="ts">
import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'

const htmlRefHook = ref<HTMLElement | null>(null)
const longPressedHook = ref(false)

const onLongPressCallbackHook = (e: PointerEvent) => {
  longPressedHook.value = true
}
const resetHook = () => {
  longPressedHook.value = false
}

onLongPress(htmlRefHook, onLongPressCallbackHook)
</script>

<template>
  <p>Long Pressed: {{ longPressedHook }}</p>

  <button ref="htmlRefHook" class="ml-2 button small">
    Press long
  </button>

  <button class="ml-2 button small" @click="resetHook">
    Reset
  </button>
</template>
```

### As a component

<LearnMoreComponents />

```html
<script setup lang="ts">
import { ref } from 'vue'
import { OnLongPress } from '@vueuse/components'

const longPressedComponent = ref(false)

const onLongPressCallbackComponent = (e: PointerEvent) => {
  longPressedComponent.value = true
}
const resetComponent = () => {
  longPressedComponent.value = false
}
</script>

<template>
  <p>Long Pressed: {{ longPressedComponent }}</p>

  <OnLongPress as="button" class="ml-2 button small" @trigger="onLongPressCallbackComponent">
    Press long
  </OnLongPress>

  <button class="ml-2 button small" @click="resetComponent">
    Reset
  </button>
</template>
```

### As a directive

<LearnMoreComponents />

```html
<script setup lang="ts">
import { ref } from 'vue'
import { VOnLongPress } from '@vueuse/components'

const longPressedDirective = ref(false)

const onLongPressCallbackDirective = (e: PointerEvent) => {
  longPressedDirective.value = true
}
const resetDirective = () => {
  longPressedDirective.value = false
}
</script>

<template>
  <p>Long Pressed: {{ longPressedDirective }}</p>

  <button v-on-long-press="onLongPressCallbackDirective" class="ml-2 button small">
    Press long
  </button>

  <button v-on-long-press="{handler: onLongPressCallbackDirective, options: {delay: 1000}}" class="ml-2 button small">
    Press long (with options)
  </button>

  <button class="ml-2 button small" @click="resetDirective">
    Reset
  </button>
</template>
```
