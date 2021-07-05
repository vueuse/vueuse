---
category: Sensors
---

# useWindowFocus

Reactively track window focus with `window.onfocus` and `window.onblur` events.

## Usage

```js
import { useWindowFocus } from '@vueuse/core'

const focused = useWindowFocus()
```

## Component
```html
<UseWindowFocus v-slot="{ focused }">
  Document Focus: {{ focused }}
</UseWindowFocus>
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactively track window focus with `window.onfocus` and `window.onblur`.
 *
 * @see https://vueuse.org/useWindowFocus
 * @param options
 */
export declare function useWindowFocus({
  window,
}?: ConfigurableWindow): Ref<boolean>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useWindowFocus/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useWindowFocus/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useWindowFocus/index.md)


<!--FOOTER_ENDS-->
