---
category: Reactivity
---

# toRefs

Extended [`toRefs`](https://v3.vuejs.org/api/refs-api.html#torefs) that also accepts refs of an object.

## Usage

<!-- eslint-disable array-bracket-spacing -->
<!-- eslint-disable @typescript-eslint/no-redeclare -->

```ts
import { toRefs } from '@vueuse/core'
import { reactive, ref } from 'vue'

const objRef = ref({ a: 'a', b: 0 })
const arrRef = ref(['a', 0])

const { a, b } = toRefs(objRef)
const [ a, b ] = toRefs(arrRef)

const obj = reactive({ a: 'a', b: 0 })
const arr = reactive(['a', 0])

const { a, b } = toRefs(obj)
const [ a, b ] = toRefs(arr)
```

## Use-cases

### Destructuring a props object

```html
<template>
  <div>
    <input v-model="a" type="text" />
    <input v-model="b" type="text" />
  </div>
</template>

<script lang="ts">
import { toRefs, useVModel } from '@vueuse/core'

export default {
  setup(props) {
    const refs = toRefs(useVModel(props, 'data'))

    console.log(refs.a.value) // props.data.a
    refs.a.value = 'a' // emit('update:data', { ...props.data, a: 'a' })

    return { ...refs }
  }
}
</script>
```
