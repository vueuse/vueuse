---
category: Browser
---

# useBreakpoints

Reactive viewport breakpoints

## Usage

```js
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.larger('sm')
```

```js
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const laptop = breakpoints.between('laptop', 'desktop')
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare const breakpointsTailwind: {
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
}
/**
 * Reactively viewport breakpoints
 *
 * @see   {@link https://vueuse.org/useBreakpoints}
 * @param options
 */
export declare function useBreakpoints<K extends string>(
  breakpoints: Record<K, number | string>,
  options?: ConfigurableWindow
): {
  greater(k: K): Ref<boolean>
  smaller(k: K): Ref<boolean>
  between(a: K, b: K): Ref<boolean>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useBreakpoints/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useBreakpoints/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useBreakpoints/index.md)


<!--FOOTER_ENDS-->
