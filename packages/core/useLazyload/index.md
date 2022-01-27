---
category: Elements
---

# useLazyload

lazy load the img or picture or video

## Usage
```html
<div class="root">
  <img ref="target" alt="it is a test png">
</div>
```
```ts
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'

export default {
    setup() {
      const target = ref(null)
      useLazyload(target)
      return {
          target
      }
    }
}
```
