---
category: Utilities
---

# useToggle

> A boolean switcher with utility functions.

## Usage

```js
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * A boolean ref with a toggler
 *
 * @see   {@link https://vueuse.js.org/useToggle}
 * @param [initialValue=false]
 */
export declare function useToggle(value: Ref<boolean>): Fn
export declare function useToggle(initialValue?: boolean): [Ref<boolean>, Fn]
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/index.md)


<!--FOOTER_ENDS-->