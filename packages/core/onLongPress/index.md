---
category: Sensors
---

# onLongPress

Listen for a long press on an element.

Function provides modifiers in options

- stop
- once
- prevent
- capture
- self

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'

const htmlRefHook = ref<HTMLElement>()
const longPressedHook = ref(false)

function onLongPressCallbackHook(e: PointerEvent) {
  longPressedHook.value = true
}
function resetHook() {
  longPressedHook.value = false
}

onLongPress(
  htmlRefHook,
  onLongPressCallbackHook,
  {
    modifiers: {
      prevent: true
    }
  }
)
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

## Component Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { OnLongPress } from '@vueuse/components'

const longPressedComponent = ref(false)

function onLongPressCallbackComponent(e: PointerEvent) {
  longPressedComponent.value = true
}
function resetComponent() {
  longPressedComponent.value = false
}
</script>

<template>
  <p>Long Pressed: {{ longPressedComponent }}</p>

  <OnLongPress
    as="button"
    class="ml-2 button small"
    @trigger="onLongPressCallbackComponent"
  >
    Press long
  </OnLongPress>

  <button class="ml-2 button small" @click="resetComponent">
    Reset
  </button>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { vOnLongPress } from '@vueuse/components'

const longPressedDirective = ref(false)

function onLongPressCallbackDirective(e: PointerEvent) {
  longPressedDirective.value = true
}
function resetDirective() {
  longPressedDirective.value = false
}
</script>

<template>
  <p>Long Pressed: {{ longPressedDirective }}</p>

  <button
    v-on-long-press.prevent="onLongPressCallbackDirective"
    class="ml-2 button small"
  >
    Press long
  </button>

  <button
    v-on-long-press="[onLongPressCallbackDirective, { delay: 1000, modifiers: { stop: true } }]"
    class="ml-2 button small"
  >
    Press long (with options)
  </button>

  <button class="ml-2 button small" @click="resetDirective">
    Reset
  </button>
</template>
```
