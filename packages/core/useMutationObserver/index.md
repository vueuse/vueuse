---
category: Sensors
---

# useMutationObserver

Watch for changes being made to the DOM tree. [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

## Usage

```ts
import { ref } from 'vue'
import { useMutationObserver } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const messages = ref([])
  
    useMutationObserver(el, (mutations) => {
      if (!mutations[0])
        messages.value.push(mutations[0].attributeName)
    }, {
      attributes: true,
    })

    return {
      el,
      messages,
    }
  },
}
```




<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface MutationObserverOptions
  extends MutationObserverInit,
    ConfigurableWindow {}
/**
 * Watch for changes being made to the DOM tree.
 *
 * @see   {@link https://vueuse.js.org/useMutationObserver}
 * @see   {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|MutationObserver MDN}
 * @param el
 * @param callback
 * @param options
 */
export declare function useMutationObserver(
  el: MaybeRef<HTMLElement | null | undefined>,
  callback: MutationCallback,
  options?: MutationObserverOptions
): {
  isSupported: boolean | undefined
  stop: () => void
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useMutationObserver/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useMutationObserver/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useMutationObserver/index.md)


<!--FOOTER_ENDS-->