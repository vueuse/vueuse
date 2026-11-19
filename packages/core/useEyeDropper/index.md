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

## Initial Values

Before a color is picked (e.g. during SSR), `sRGBHex` is `''`. Set your own initial value with `initials`:

```ts
import { useEyeDropper } from '@vueuse/core'
// ---cut---
const { sRGBHex } = useEyeDropper({ initials: { sRGBHex: '#ffffff' } })
```

The returned `sRGBHex` is readonly. To own the state, pass your own ref to `initials`, `useEyeDropper` writes into it.

## Component Usage

```vue
<template>
  <UseEyeDropper v-slot="{ isSupported, sRGBHex, open }">
    <button :disabled="!isSupported" @click="() => open()">
      sRGBHex: {{ sRGBHex }}
    </button>
  </UseEyeDropper>
</template>
```
