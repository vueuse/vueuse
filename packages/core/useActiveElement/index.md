---
category: Browser
---

# useActiveElement

Reactive `document.activeElement`

## Usage

```js
import { useActiveElement } from '@vueuse/core'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive `document.activeElement`
 *
 * @link https://vueuse.org/useActiveElement
 * @param options
 */
export declare function useActiveElement<T extends HTMLElement>(
  options?: ConfigurableWindow
): ComputedRef<T | null | undefined>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/index.md)


<!--FOOTER_ENDS-->
