---
category: Elements
---

# useVisible

Sets the visibility of an element.

Sometimes v-if and v-show are not enough. The v-if directive removes an element from the DOM and the v-show directive sets the display value to none. Both of them come with the caveat that the element does not take any space in the DOM anymore.
useVisible adds the flexibility to hide an element, but keep their space in the DOM.


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
