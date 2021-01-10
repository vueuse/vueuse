---
category: Browser
---


# usePreferredDark

> Reactive dark theme preference.

## Usage

```js
import { usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive dark theme preference.
 *
 * @see   {@link https://vueuse.js.org/usePreferredDark}
 * @param [options]
 */
export declare function usePreferredDark(
  options?: ConfigurableWindow
): Ref<boolean>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredDark/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredDark/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredDark/index.md)


<!--FOOTER_ENDS-->
