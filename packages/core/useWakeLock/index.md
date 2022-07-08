---
category: Browser
---

# useWakeLock

Reactive [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API). Provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

## Usage

```js
import { useWakeLock } from '@vueuse/core'

const { isSupported, isActive, request, release } = useWakeLock()
```

If `request` is called,` isActive` will be **true**, and if `release` is called, or other tab is displayed, or the window is minimized,`isActive` will be **false**.
