---
category: Component
related: useVModel
---

# useVModels

Shorthand for props v-model binding. Think it like `toRefs(props)` but changes will also trigger emit.

## Usage

```js
import { useVModels } from '@vueuse/core'

export default {
  props: {
    foo: String,
    bar: Number,
  },
  setup(props, { emit }) {
    const { foo, bar } = useVModels(props, emit)

    console.log(foo.value) // props.foo
    foo.value = 'foo' // emit('update:foo', 'foo')
  },
}
```
