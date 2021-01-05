---
category: Sensors
---

<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->


# usePageLeave

> Reactive state to show whether the mouse leaves the page.

## Usage

```js
import { usePageLeave } from '@vueuse/core'

const isLeft = usePageLeave()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see   {@link https://vueuse.js.org/usePageLeave}
 * @param options
 */
export declare function usePageLeave(options?: ConfigurableWindow): Ref<boolean>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/usePageLeave/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/usePageLeave/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/usePageLeave/index.md)


<!--FOOTER_ENDS-->