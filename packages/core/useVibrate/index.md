---
category: Sensors
---

# useVibrate

Reactive hook to provide physical feedback with device vibration hardware using the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API).

## Usage

```js
import { useVibrate } from '@vueuse/core'

const vibrating = ref(false)

useVibrate(vibrating)

// vibrating.value = true => vibration will start
// vibrating.value = false => vibration will end

```

To start and stop the vibration using controls

```js
import { useVibrate } from '@vueuse/core'

const vibrating = ref(false)

const { pause, resume } = useVibrate(vibrating, {
  pattern: [300, 100, 200, 100, 1000, 300],
  loop: true,
})

// resume() => vibration will start
// pause() => vibration will end

```



<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface VibrateOptions extends ConfigurableNavigator {
  /**
   * Vibration Pattern
   *
   * @default [1000, 1000]
   */
  pattern?: VibratePattern
  /**
   * Infinitely continue the vibrations
   *
   * @default true
   */
  loop?: boolean
}
export interface UseVibrateReturn extends IntervalFnReturn {
  isSupported: boolean
}
/**
 * Reactive Vibration API.
 *
 * @see https://vueuse.org/useVibrate
 * @param enabled
 * @param options
 */
export declare function useVibrate(
  enabled?: MaybeRef<boolean | undefined>,
  options?: VibrateOptions
): UseVibrateReturn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useVibrate/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useVibrate/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useVibrate/index.md)


<!--FOOTER_ENDS-->
