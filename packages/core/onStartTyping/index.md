---
category: Sensors
---

# onStartTyping

> Fires when users start typing on non-editable elements.

## Usage

```html
<input ref="input" type="text" placeholder="Start typing to focus" />
```

```ts {7-10}
import { onStartTyping } from '@vueuse/core'

export default {
  setup() {
    const input = ref(null)

    onStartTyping(() => {
      if (!input.value.active)
        input.value.focus()
    })

    return {
      input,
    }
  },
}
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Fires when users start typing on non-editable elements.
 *
 * @see   {@link https://vueuse.js.org/onStartTyping}
 * @param callback
 * @param options
 */
export declare function onStartTyping(
  callback: (event: KeyboardEvent) => void,
  { document }?: ConfigurableDocument
): void
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/onStartTyping/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/onStartTyping/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/onStartTyping/index.md)


<!--FOOTER_ENDS-->