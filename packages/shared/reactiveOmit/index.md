---
category: Reactivity
---

# reactiveOmit

Reactively omit fields from a reactive object.

## Usage

### Basic Usage

```ts
import { reactiveOmit } from '@vueuse/core'

const obj = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0,
})

const picked = reactiveOmit(obj, 'x', 'elementX') // { y: number, elementY: number }
```

### Predicate Usage

```ts
import { reactiveOmit } from '@vueuse/core'

const obj = reactive({
  bar: 'bar',
  baz: 'should be omit',
  foo: 'foo2',
  qux: true,
})

const picked = reactiveOmit(obj, (value, key) => key === 'baz' || value === true)
// { bar: string, foo: string }
```

### Scenarios

#### Selectively passing props to child

```vue
<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'

const props = defineProps<{
  value: string
  color?: string
  font?: string
}>()

const childProps = reactiveOmit(props, 'value')
</script>

<template>
  <div>
    <!-- only passes "color" and "font" props to child -->
    <ChildComp v-bind="childProps" />
  </div>
</template>
```
