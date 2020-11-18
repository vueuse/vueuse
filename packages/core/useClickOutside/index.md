# onClickOutside

> Listen for clicks outside of an element.

## Usage

```html {19}
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
    const handler = (event) => console.log(event) 

    onClickOutside(target, handler)

    return { target }
  }
}
</script>
```
