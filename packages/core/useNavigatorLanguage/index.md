---
category: Sensors
---

# useNavigatorLanguage

Reactive [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).

## Usage

```ts
import { useNavigatorLanguage } from '@vueuse/core'

const { language } = useNavigatorLanguage()

watch(language, () => {
  // Listen to the value changing
})
```
