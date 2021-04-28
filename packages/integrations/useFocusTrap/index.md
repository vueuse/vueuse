---
category: '@Integrations'
---

# useFocusTrap

Reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap)

For more info on what options can be passed see [`createOptions`](https://github.com/focus-trap/focus-trap#createfocustrapelement-createoptions) in the `focus-trap` docs.

## Usage

**Basic Usage**

```html
<script setup>
import { ref } from 'vue'
import { useFocusTrap } from '@vueuse/integrations'

const target = ref()
const { hasFocus, activate, deactivate } = useFocusTrap(target)
</script>

<template>
  <div>
    <button @click="activate()">Activate</button>
    <div ref="target">
      <span>Has Focus: {{ hasFocus }}</span>
      <input type="text" />
      <button @click="deactivate()">Deactivate</button>
    </div>
  </div>
</template>
```

**Automatically Focus**

```html
<script setup>
import { ref } from 'vue'
import { useFocusTrap } from '@vueuse/integrations'

const target = ref()
const { hasFocus, activate, deactivate } = useFocusTrap(target, { immediate: true })
</script>

<template>
  <div>
    <div ref="target">...</div>
  </div>
</template>
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseFocusTrapOptions extends Options {
  /**
   * Immediately activate the trap
   */
  immediate?: boolean
}
export interface UseFocusTrapReturn {
  /**
   * Indicates if the focus trap is currently active
   */
  hasFocus: Ref<boolean>
  /**
   * Indicates if the focus trap is currently paused
   */
  isPaused: Ref<boolean>
  /**
   * Activate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapactivateactivateoptions
   * @param opts Activate focus trap options
   */
  activate: (opts?: ActivateOptions) => void
  /**
   * Deactivate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapdeactivatedeactivateoptions
   * @param opts Deactivate focus trap options
   */
  deactivate: (opts?: DeactivateOptions) => void
  /**
   * Pause the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trappause
   */
  pause: Fn
  /**
   * Unpauses the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapunpause
   */
  unpause: Fn
}
/**
 * Reactive focus-trap
 *
 * @see https://vueuse.org/useFocusTrap
 * @param target The target element to trap focus within
 * @param options Focus trap options
 * @param autoFocus Focus trap automatically when mounted
 */
export declare function useFocusTrap(
  target: MaybeElementRef,
  options?: UseFocusTrapOptions
): UseFocusTrapReturn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useFocusTrap/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useFocusTrap/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useFocusTrap/index.md)


<!--FOOTER_ENDS-->
