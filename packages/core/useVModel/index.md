---
category: Component
---

# useVModel

Shorthand for v-model binding, props + emit -> ref

> We encourage you to use Vue's [`defineModel`](https://vuejs.org/api/sfc-script-setup.html#definemodel) over this composable, however there are some edge-cases like using `TSX` or the `deep: true` option that `defineModel` doesn't support.

## Usage

```ts
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const data = useVModel(props, 'modelValue', emit)
```

### Options API

```ts
import { useVModel } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const data = useVModel(props, 'data', emit)

    console.log(data.value) // props.data
    data.value = 'foo' // emit('update:data', 'foo')
  },
}
```
