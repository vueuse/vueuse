<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS-->
::: tip
💡 this function is also available in [Vue Reactivity](https://github.com/vue-reactivity/use)


:::

<!--HEAD_ENDS-->


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
export declare function useToggle(
  initialValue?: boolean
): readonly [Ref<boolean>, () => boolean]
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useToggle/index.md)


<!--FOOTER_ENDS-->