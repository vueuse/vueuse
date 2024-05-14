---
category: Reactivity
alias: useDebounce, debouncedRef
---

# refDebounced

Debounce execution of a ref value.

## Usage

```js {4}
import { refDebounced } from '@vueuse/core'

const input = ref('foo')
const debounced = refDebounced(input, 1000)

input.value = 'bar'
console.log(debounced.value) // 'foo'

await sleep(1100)

console.log(debounced.value) // 'bar'
```

An example with object ref.

```js {4}
import { refDebounced } from '@vueuse/core'

const input = ref({ type: 'foo' })
const debounced = refDebounced(input, 1000, { deep: true }) // Add deep to deeply watch changes of input

input.value.type = 'bar'
console.log(debounced.value) // { type: 'foo' }

await sleep(1100)

console.log(debounced.value) // { type: 'bar' }
```

The 2nd parameter is the debounce wait time in milliseconds, default to `200`ms.

You can also pass an optional 3rd parameter including `deep` and `maxWait` options. See `useDebounceFn` for details.

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
