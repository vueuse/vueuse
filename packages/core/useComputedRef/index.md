# useComputedRef

`useComputedRef` is a wrapper for standard computed. The API is same as standard computed.
Standard computed will be mark as dirty when some dependencies inside it's getter has changed.
It will always trigger the dependency collect of watcher who watching the computed.
In Vue component, there's a invisible watcher behind our template (to trigger render function when some reactive value changed).
That means you will always trigger render function whatever your computed value change or not.
The `useComputedRef` will cache and avoid these changes, and only trigger if the computed value changed.


## Usage

```ts
import { watch } from 'vue-demi'
import { useComputedRef } from '@vueuse/core'

const value = ref(1);
const isOdd = computed(() => {
  return value.value % 2 === 0;
});

watch(() => {
    console.log('dep changed') // will trigger after 'value' has been assigned whatever 'value' is odd or not.
    return isOdd.value
}, () => {
    console.log('watcher changed') // only trigger when 'isOdd' has been changed.
})

```
