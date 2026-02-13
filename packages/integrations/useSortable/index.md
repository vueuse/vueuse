---
category: '@Integrations'
---

# useSortable

Wrapper for [`sortable`](https://github.com/SortableJS/Sortable).

For more information on what options can be passed, see [`Sortable.options`](https://github.com/SortableJS/Sortable#options) in the `Sortable` documentation.

::: warning
Currently, `useSortable` only implements drag-and-drop sorting for a single list.
:::

## Install

```bash
npm i sortablejs@^1
```

::: tip NOTE

If you're using TypeScript, it will throw errors for any `options` passed to `useSortable`, as `sortablejs` does not provide built-in type definitions.

To avoid this, install the typings manually:

```bash
npm i -D @types/sortablejs@^1
```

:::

## Usage

### Use template ref

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const list = shallowRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

useSortable(el, list)
</script>

<template>
  <div ref="el">
    <div v-for="item in list" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

### Use specifies the selector to operate on

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const list = shallowRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

const animation = 200

const { option } = useSortable(el, list, {
  handle: '.handle',
  // or option set
  // animation
})

// You can use the option method to set and get the option of Sortable
option('animation', animation)
// option('animation') // 200
</script>

<template>
  <div ref="el">
    <div v-for="item in list" :key="item.id">
      <span>{{ item.name }}</span>
      <span class="handle">*</span>
    </div>
  </div>
</template>
```

### Use a selector to get the root element

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { shallowRef } from 'vue'

const list = shallowRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

useSortable('#dv', list)
</script>

<template>
  <div id="dv">
    <div v-for="item in list" :key="item.id">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
```

### Return Values

| Property | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| `start`  | Initialize the Sortable instance (called automatically on mount) |
| `stop`   | Destroy the Sortable instance                                    |
| `option` | Get or set Sortable options at runtime                           |

```ts
const { start, stop, option } = useSortable(el, list)

// Stop sorting
stop()

// Start sorting again
start()

// Get/set options
option('animation', 200) // set
const animation = option('animation') // get
```

### Watch Element Changes

Use the `watchElement` option to automatically reinitialize Sortable when the element changes (useful with `v-if`).

```ts
import { useSortable } from '@vueuse/integrations/useSortable'

useSortable(el, list, {
  watchElement: true, // auto-reinitialize when element changes
})
```

### Custom Update Handler

If you want to handle the `onUpdate` yourself, you can pass in `onUpdate` parameters, and we also exposed a function to move the item position.

```ts
import { moveArrayElement, useSortable } from '@vueuse/integrations/useSortable'

useSortable(el, list, {
  onUpdate: (e) => {
    // do something
    moveArrayElement(list, e.oldIndex, e.newIndex, e)
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
    nextTick(() => {
      /* do something */
    })
  }
})
```

### Helper Functions

The following helper functions are also exported:

| Function                                   | Description                                           |
| ------------------------------------------ | ----------------------------------------------------- |
| `moveArrayElement(list, from, to, event?)` | Move an element in an array from one index to another |
| `insertNodeAt(parent, element, index)`     | Insert a DOM node at a specific index                 |
| `removeNode(node)`                         | Remove a DOM node from its parent                     |
