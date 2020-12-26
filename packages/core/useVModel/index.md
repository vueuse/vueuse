<!--DEMO_STARTS--><!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->

# useVModel

> Shorthand for v-model binding, props + emit -> ref

## Usage

```js
import { useVModel } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const data = useVModel(props, 'data', emit)

    console.log(data.value) // props.data
    data.value = 'foo' // emit('update:data', 'foo')
  },
}
```


<!--FOOTER_STARTS-->
## Typing

```typescript
/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see   {@link https://vueuse.js.org/useVModel}
 * @param props
 * @param key
 * @param emit
 */
export declare function useVModel<P extends object>(
  props: P,
  key: keyof P,
  emit?: (name: string, value: any) => void
): WritableComputedRef<unknown>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useVModel/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useVModel/index.md)


<!--FOOTER_ENDS-->