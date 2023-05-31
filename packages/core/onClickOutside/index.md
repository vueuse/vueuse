---
category: Sensors
---

# onClickOutside

Listen for clicks outside of an element. Useful for modal or dropdown.

## Usage

```html {18}
<template>
  <div ref="target">
    Hello world
  </div>
  <div>
    Outside element
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)

    onClickOutside(target, (event) => console.log(event))

    return { target }
  }
}
</script>
```

> This function uses [Event.composedPath()](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath) which is NOT supported by IE 11, Edge 18 and below. If you are targeting these browsers, we recommend you to include [this code snippet](https://gist.github.com/sibbng/13e83b1dd1b733317ce0130ef07d4efd) on your project.

## Component Usage

```html
<OnClickOutside @trigger="count++" :options="{ ignore: [/* ... */] }">
  <div>
    Click Outside of Me
  </div>
</OnClickOutside>
```
## Directive Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'

const modal = ref(false)
function closeModal() {
  modal.value = false
}

</script>

<template>
  <button @click="modal = true">
    Open Modal
  </button>
  <div v-if="modal" v-on-click-outside="closeModal">
    Hello World
  </div>
</template>
```

You can also set the handler as an array to set the configuration items of the instruction.

```html
<script setup>
import { ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'

const modal = ref(false)

const ignoreElRef = ref()

const onClickOutsideHandler = [
  (ev) => {
    console.log(ev)
    modal.value = false
  },
  { ignore: [ignoreElRef] }
]

</script>

<template>
  <button @click="modal = true">
    Open Modal
  </button>

  <div ref="ignoreElRef">
    click outside ignore element
  </div>

  <div v-if="modal" v-on-click-outside="onClickOutsideHandler">
    Hello World
  </div>
</template>

```
