---
category: Reactivity
alias: useDebounce, debouncedRef
---

# refDebounced

Debounce execution of a ref value.

## Usage

```js {5}
import { refDebounced } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('foo')
const debounced = refDebounced(input, 1000)

input.value = 'bar'
console.log(debounced.value) // 'foo'

await sleep(1100)

console.log(debounced.value) // 'bar'
```

An example with object ref.

```js
import { refDebounced } from '@vueuse/core'
import { shallowRef } from 'vue'

const data = shallowRef({
  name: 'foo',
  age: 18,
})
const debounced = refDebounced(data, 1000)

function update() {
  data.value = {
    ...data.value,
    name: 'bar',
  }
}

console.log(debounced.value) // { name: 'foo', age: 18 }
update()
await sleep(1100)

console.log(debounced.value) // { name: 'bar', age: 18 }
```

You can also pass an optional 3rd parameter including maxWait option. See `useDebounceFn` for details.

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
