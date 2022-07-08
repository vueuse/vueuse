---
category: Sensors
---

# useNavigatorLanguage

Reactive [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).

## Usage

```ts
import { defineComponent, ref } from 'vue'
import { useNavigatorLanguage } from '@vueuse/core'

export default defineComponent({
  setup() {
    const { language } = useNavigatorLanguage()

    watch(language, () => {
      // Listen to the value changing
    })

    return {
      language,
    }
  },
})
```
