---
category: Browser
---

# useEyeDropper

Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)

## Usage

```ts
import { useEyeDropper } from '@vueuse/core'

const { isSupported, open, sRGBHex } = useEyeDropper()
```

## Component Usage

```html
<UseEyeDropper v-slot="{ isSupported, sRGBHex, open }">
  <button :disabled="!isSupported" @click="open">
    sRGBHex: {{ sRGBHex }}
  </button>
</UseEyeDropper>
```
