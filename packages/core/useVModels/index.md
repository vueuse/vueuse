---
category: Component
---

# useVModels

Shorthand for props v-model binding. Think like `toRefs(props)` but changes will also emit out.

## Usage

```js
import { useVModel } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const { modal } = useVModel(props)

    console.log(modal.value) // props.data
    data.value = 'foo' // emit('update:data', 'foo')
  },
}
```

## Related

- `useVModel`


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see   {@link https://vueuse.org/useVModel}
 * @param props
 * @param key (default 'value' in Vue 2 and 'modelValue' in Vue 3)
 * @param emit
 */
export declare function useVModel<
  P extends object,
  K extends keyof P,
  Name extends string
>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void
): WritableComputedRef<P[K]>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useVModel/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useVModel/index.md)


<!--FOOTER_ENDS-->
