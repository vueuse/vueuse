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

When you pass keys, `reactiveOmit` returns a live view of the source object rather than a copy. Reads, writes, deletions, `in` checks, and enumeration all go to the source, and omitted keys are hidden from every one of them:

```ts
picked.y = 10 // sets `obj.y`

'x' in picked // false
Object.keys(picked) // ['y', 'elementY']
```

The view keeps the reactivity of its source. For example, the result of omitting keys from component props is shallow and, in development, readonly, the same as the props themselves.

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
