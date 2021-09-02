---
category: Browser
---

# useWakeLock

Reactive [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

## Usage

```js
import { useWakeLock } from '@vueuse/core'

const { isSupported, isActive, request, release } = useWakeLock()
```

If `isActive` is called,` isActive` will be **true**, and if `release` is called, or other tab is displayed, or the window is minimized,`isActive` will be **false**.

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface WakeLockSentinel extends EventTarget {
  type: 'screen'
  released: boolean
  release: () => Promise<void>
}
/**
 * Reactive Screen Wake Lock API.
 *
 * @see https://vueuse.org/useWakeLock
 * @param options
 */
export declare function useWakeLock({ navigator }?: ConfigurableNavigator): {
  isSupported: boolean
  isActive: Ref<boolean>
  request: (type: 'screen') => Promise<void>
  release: () => Promise<void>
}
export declare type UseWakeLockReturn = ReturnType<typeof useWakeLock>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useWakeLock/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useWakeLock/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useWakeLock/index.md)


<!--FOOTER_ENDS-->
