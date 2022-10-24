---
category: Elements
---

# useVisible

Listen for a long press on an element.


## Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { useVisible } from '@vueuse/core'

const htmlRef = ref<HTMLElement | null>(null)

const { visible } = useVisible(htmlRef, true)
</script>

<template>
  <p>Visible: {{ visible }} /></p>
  <div ref="htmlRef">
    Hello World
  </div>
  <button class="ml-2 button small" @click="() => visible = !visible">
    Toggle
  </button>
</template>
```

## Component Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { Visible } from '@vueuse/components'

const visible = ref(false)

</script>

<template>
 <p>Visible: {{ visible }} /></p>

  <Visible
    as="p"
    :show="visible"
  >
    Hello World
  </Visible>

  <button class="ml-2 button small" @click="() => visible = !visible">
    Toggle
  </button>
</template>
```

## Directive Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { vVisible } from '@vueuse/components'

const visible = ref(false)

</script>

<template>
  <p>Visible: {{ visible }} /></p>

  <div
    v-visible="visible"
  >
    Hello World
  </div>

  <button class="ml-2 button small" @click="() => visible = !visible">
    Toggle
  </button>
</template>
```
