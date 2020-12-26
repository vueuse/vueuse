<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS-->
💡 this function is also available in [Vue Reactivity](https://github.com/vue-reactivity/use)


<!--HEAD_ENDS-->


# useDebounce

> Debounce execution of a ref value.

## Usage

```js {4}
import { useDebounce } from '@vueuse/core'

const input = ref('foo')
const debounced = useDebounce(input, 1000)

input.value = 'bar'
console.log(debounced.value) // 'foo'

await sleep(1100)

console.log(debounced.value) // 'bar'
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/utilities--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/utilities--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/utilities--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/utilities--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)


<!--FOOTER_STARTS-->
## Typing

```typescript
export declare function useDebounce<T>(value: Ref<T>, ms?: number): Ref<T>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useDebounce/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useDebounce/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useDebounce/index.md)


<!--FOOTER_ENDS-->