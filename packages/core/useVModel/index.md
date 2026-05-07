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

## Options

### Passive Mode

By default, `useVModel` returns a computed ref. In passive mode, it creates a local ref that syncs with the prop via `watch`, allowing deep reactivity tracking.

```ts
const data = useVModel(props, 'modelValue', emit, { passive: true })
```

### Deep Watching

When using `passive: true`, you can enable deep watching for nested object changes:

```ts
const data = useVModel(props, 'modelValue', emit, {
  passive: true,
  deep: true,
})
```

### Clone Values

Clone the prop value to avoid mutating the original object. Set to `true` to use `JSON.parse(JSON.stringify())` or provide a custom clone function.

```ts
const data = useVModel(props, 'modelValue', emit, {
  clone: true,
  // or provide custom clone function
  // clone: (val) => structuredClone(val),
})
```

### Default Value

Provide a default value when the prop is undefined:

```ts
const data = useVModel(props, 'modelValue', emit, {
  defaultValue: 'default',
})
```

### Custom Event Name

Override the default `update:propName` event name:

```ts
const data = useVModel(props, 'value', emit, {
  eventName: 'change',
})
```

### Emit Validation

Use `shouldEmit` to validate before emitting. Return `false` to prevent the emit:

```ts
const data = useVModel(props, 'modelValue', emit, {
  shouldEmit: (value) => {
    // Only emit if value is valid
    return value.length > 0
  },
})
```
