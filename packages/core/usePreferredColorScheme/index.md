---
category: Browser
---

# usePreferredColorScheme

Reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## Usage

```js
import { usePreferredColorScheme } from '@vueuse/core'

const preferredColor = usePreferredColorScheme()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type ColorSchemeType = "dark" | "light" | "no-preference"
/**
 * Reactive prefers-color-scheme media query.
 *
 * @see   {@link https://vueuse.js.org/usePreferredColorScheme}
 * @param [options]
 */
export declare function usePreferredColorScheme(
  options?: ConfigurableWindow
): ComputedRef<ColorSchemeType>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/usePreferredColorScheme/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/usePreferredColorScheme/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/usePreferredColorScheme/index.md)


<!--FOOTER_ENDS-->