---
category: Browser
---

# useWakeLock

Reactive [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API). Provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

## Usage

```ts
import { useWakeLock } from '@vueuse/core'

const { isSupported, isActive, forceRequest, request, release } = useWakeLock()
```

When `request` is called, the wake lock will be requested if the document is visible. Otherwise, the request will be queued until the document becomes visible. If the request is successful, `isActive` will be **true**. Whenever the document is hidden, the `isActive` will be **false**.

The underlying lock can also be revoked by the OS or browser without the document ever becoming hidden (for example, iOS Safari can silently drop it). When that happens, `isActive` becomes **false** immediately, and the lock is transparently re-requested as long as the document is still visible.

When `release` is called, the wake lock will be released. If there is a queued request, it will be canceled.

To request a wake lock immediately, even if the document is hidden, use `forceRequest`. Note that this may throw an error if the document is hidden.
