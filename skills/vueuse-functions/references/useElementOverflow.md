---
category: Elements
---

# useElementOverflow

Reactive element's overflow state.

## Usage

```vue
<script setup>
import { useElementOverflow } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isXOverflowed } = useElementOverflow(el)
</script>

<template>
  <div ref="el" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </div>
</template>
```

## Component Usage

```vue
<script setup lang="ts">
import { UseElementOverflow } from '@vueuse/components'
</script>

<template>
  <UseElementOverflow v-slot="{ isXOverflowed }" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </UseElementOverflow>
</template>
```

## Directive Usage

```vue
<script>
import type { UseElementOverflowReturn } from '@vueuse/core'
import { vElementOverflow } from '@vueuse/components'
import { ref } from 'vue'

export default {
  setup() {
    const isXOverflowed = ref(false)
    function onXOverflowChanged(info: UseElementOverflowReturn) {
      isXOverflowed.value = info.isXOverflowed
    }
    return {
      isXOverflowed,
      onXOverflowChanged,
    }
  },
}
</script>

<template>
  <div v-element-overflow="onXOverflowChanged" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </div>
</template>
```

## Type Declarations

```ts
export interface UseElementOverflowOptions extends ConfigurableWindow {
  /**
   * Use MutationObserver to observe the target and its children.
   *
   * @default false
   */
  observeMutation?: boolean | MutationObserverInit
  /**
   * Callback when observer triggered.
   */
  onUpdated?: ResizeObserverCallback | MutationCallback
}
/**
 * react a dom's overflow state
 * @see https://vueuse.org/useElementOverflow
 * @param target
 * @param option
 */
export declare function useElementOverflow(
  target: MaybeComputedElementRef,
  option?: UseElementOverflowOptions,
): {
  isXOverflowed: Readonly<ShallowRef<boolean, boolean>>
  isYOverflowed: Readonly<ShallowRef<boolean, boolean>>
  stop: typeof stop
  update: () => void
}
export type UseElementOverflowReturn = ReturnType<typeof useElementOverflow>
```
