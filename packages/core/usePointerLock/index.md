---
category: Sensors
---

# usePointerLock

Reactive [pointer lock](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API).

## Basic Usage

```js
import { usePointerLock } from '@vueuse/core'

const { isSupported, lock, unlock, element, triggerElement } = usePointerLock()
```

## Component Usage

```html
<UsePointerLock v-slot="{ lock }">
  <canvas />
  <button @click="lock">
    Lock Pointer on Canvas
  </button>
</UsePointerLock>
```
