---
category: Sensors
---

# useDocumentVisibility

Reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)

## Usage

```js
import { useDocumentVisibility } from '@vueuse/core'

const visibility = useDocumentVisibility()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactively track `document.visibilityState`.
 *
 * @see   {@link https://vueuse.js.org/useDocumentVisibility}
 * @param options
 */
export declare function useDocumentVisibility({
  document,
}?: ConfigurableDocument): Ref<VisibilityState>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useDocumentVisibility/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useDocumentVisibility/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useDocumentVisibility/index.md)


<!--FOOTER_ENDS-->
