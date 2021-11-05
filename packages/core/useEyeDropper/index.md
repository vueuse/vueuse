---
category: Browser
---

# useEyeDropper

Reactive [EyeDropper_API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)

## Usage

```ts
import { useEyeDropper } from '@vueuse/core'

const { isSupported, eyeDropper, sRGBHex } = useEyeDropper()
```

## Component

```html
<UseEyeDropper v-slot="{ isSupported, sRGBHex, eyeDropper }">
  <button :disabled="!isSupported" @click="eyeDropper">
    sRGBHex: {{ sRGBHex }}
  </button>
</UseEyeDropper>
```