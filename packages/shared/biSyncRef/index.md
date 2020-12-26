<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS-->
💡 this function is also available in [Vue Reactivity](https://github.com/vue-reactivity/use)


<!--HEAD_ENDS-->


# biSyncRef

> Two-way refs synchronization.

## Usage

```ts
import { biSyncRef } from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = biSyncRef(a, b)

console.log(a.value) // hello

b.value = 'foo'

console.log(a.value) // foo

a.value = 'bar'

console.log(b.value) // bar
```

## Related Functions

- [syncRef](https://vueuse.js.org/?path=/story/utilities--syncref)


<!--FOOTER_STARTS-->
## Typing

```typescript
/**
 * Two-way refs synchronization.
 *
 * @param a
 * @param b
 */
export declare function biSyncRef<R extends Ref<any>>(a: R, b: R): () => void
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/biSyncRef/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/biSyncRef/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/biSyncRef/index.md)


<!--FOOTER_ENDS-->