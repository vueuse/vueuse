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


# useOnline

> Reactive online state. A wrapper of [`useNetwork`](/?path=/story/sensors--usenetwork)

## Usage

```js
import { useOnline } from '@vueuse/core'

const online = useOnline()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive online state.
 *
 * @see   {@link https://vueuse.js.org/useOnline}
 * @param options
 */
export declare function useOnline(options?: ConfigurableWindow): Ref<boolean>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useOnline/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useOnline/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useOnline/index.md)


<!--FOOTER_ENDS-->