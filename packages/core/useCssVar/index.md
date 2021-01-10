---
category: Browser
---


# useCssVar

> Manipulate CSS variables

## Usage

```js
import { useCssVar } from '@vueuse/core'

const el = ref(null)
const color = useCssVar('--color', el)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Manipulate CSS variables.
 *
 * @see   {@link https://vueuse.js.org/useCssVar}
 * @param prop
 * @param el
 * @param options
 */
export declare function useCssVar(
  prop: string,
  el?: MaybeRef<HTMLElement | null>,
  { window }?: ConfigurableWindow
): Ref<string>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useCssVar/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useCssVar/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useCssVar/index.md)


<!--FOOTER_ENDS-->
