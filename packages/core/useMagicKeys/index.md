---
category: Sensors
---

# useMagicKeys

Reactive keys pressed state, with magical keys combination support.

> This function uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which is NOT supported by IE 11 or below.

## Usage

```js
import { useMagicKeys } from '@vueuse/core'

const { shift, space, a /* keys you want to monitor */ } = useMagicKeys()

watch(space, (v) => {
  if (v)
    console.log('space has been pressed')
})

watchEffect(() => {
  if (shift.value && a.value)
    console.log('Shift + A have been pressed')
})
```

### Combinations

You can magically use combinations (shortcuts/hotkeys) by connecting keys with `+` or `_`

```ts
import { useMagicKeys } from '@vueuse/core'

const keys = useMagicKeys()
const shiftCtrlA = keys['Shift+Ctrl+A']

watch(shiftCtrlA, (v) => {
  if (v)
    console.log('Shift + Ctrl + A have been pressed')
})
```

```ts
import { useMagicKeys } from '@vueuse/core'

const { Ctrl_A_B, space, ctrl_s, /* ... */ } = useMagicKeys()

watch(Ctrl_A_B, (v) => {
  if (v)
    console.log('Control+A+B have been pressed')
})
```

You can also use `whenever` function to make it shorter

```ts
import { useMagicKeys, whenever } from '@vueuse/core'

const keys = useMagicKeys()

whenever(keys.shift_space, () => {
  console.log('Shift+Space have been pressed')
})
```

### Reactive Mode

By default, the values of `useMagicKeys()` are `Ref<boolean>`. If you want to use the object in template, you can set it to reactive mode.

```ts
const keys = useMagicKeys({ reactive: true })
```

```html
<template>
  <div v-if="keys.shift">
    You are holding the Shift key!
  <div>
</template>
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseMagicKeysOptions<Reactive extends Boolean> {
  /**
   * Returns a reactive object instead of an object of refs
   *
   * @default false
   */
  reactive?: Reactive
  /**
   * Target for listening events
   *
   * @default window
   */
  target?: MaybeRef<EventTarget>
}
/**
 * Reactive keys pressed state, with magical keys combination support.
 *
 * @link https://vueuse.org/useMagicKeys
 */
export declare function useMagicKeys(
  options?: UseMagicKeysOptions<false>
): Readonly<Record<string, ComputedRef<boolean>>>
export declare function useMagicKeys(
  options: UseMagicKeysOptions<true>
): Readonly<Record<string, boolean>>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useMagicKeys/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useMagicKeys/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useMagicKeys/index.md)


<!--FOOTER_ENDS-->
