---
category: Elements
---

# useDocumentVisibility

Reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)

## Usage

```vue
<script setup lang="ts">
import { useDocumentVisibility } from '@vueuse/core'

const visibility = useDocumentVisibility()
</script>
```

## Component Usage

```vue
<template>
  <UseDocumentVisibility v-slot="{ visibility }">
    Document Visibility: {{ visibility }}
  </UseDocumentVisibility>
</template>
```

## Type Declarations

```ts
/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useDocumentVisibility(
  options?: ConfigurableDocument,
): ShallowRef<DocumentVisibilityState, DocumentVisibilityState>
export type UseDocumentVisibilityReturn = ReturnType<
  typeof useDocumentVisibility
>
```
