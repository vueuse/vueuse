---
category: Sensors
---

# onLongPress

Listen for a longpress on an element.

## Usage


### As a hook

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { onLongpress } from '@vueuse/core'

const htmlRefHook = ref<HTMLElement | null>(null)

const longPressedHook = ref(false)

const onLongpressCallbackHook = (e: PointerEvent) => {
  longPressedHook.value = true
}

const resetHook = () => {
  longPressedHook.value = false
}

onLongpress(htmlRefHook, onLongpressCallbackHook)
</script>
<template>
  <p>Longpressed: {{ longPressedHook }}</p>

  <button ref="htmlRefHook" class="ml-2 button small">
    Press long
  </button>

  <button class="ml-2 button small" @click="resetHook">
    Reset
  </button>
</template>
```

### As a component

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { OnLongpress } from '@vueuse/components'

const longPressedComponent = ref(false)

const onLongpressCallbackComponent = (e: PointerEvent) => {
  longPressedComponent.value = true
}

const resetComponent = () => {
  longPressedComponent.value = false
}

</script>
<template>
  <p>Longpressed: {{ longPressedComponent }}</p>

  <OnLongpress as="button" class="ml-2 button small" @trigger="onLongpressCallbackComponent">
    Press long
  </OnLongpress>

  <button class="ml-2 button small" @click="resetComponent">
    Reset
  </button>
</template>
```

### As a directive

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { vOnLongpress } from '@vueuse/directives'

const longPressedDirective = ref(false)


const onLongpressCallbackDirective = (e: PointerEvent) => {
  longPressedDirective.value = true
}

const resetDirective = () => {
  longPressedDirective.value = false
}

</script>
<template>
  <p>Longpressed: {{ longPressedDirective }}</p>

  <button v-on-longpress="onLongpressCallbackDirective" class="ml-2 button small">
    Press long
  </button>

  <button v-on-longpress="{handler: onLongpressCallbackDirective, {delay: 1000}}" class="ml-2 button small">
    Press long (with options)
  </button>

  <button class="ml-2 button small" @click="resetDirective">
    Reset
  </button>
</template>
```
