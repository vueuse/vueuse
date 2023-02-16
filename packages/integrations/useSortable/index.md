---
category: '@Integrations'
---

# useSortable

Wrapper for [`sortable`](https://github.com/SortableJS/Sortable).

## Install 

```bash
npm i sortablejs
```

## Usage

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations'
import { ref } from 'vue'

const el = ref<HTMLElement | null>(null)
const list = ref([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

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

or specifies the selector to operate on

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations'
import { ref } from 'vue'

const el = ref<HTMLElement | null>(null)
const list = ref([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

useSortable(el, list, {
  handle: '.handle'
})
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

sor use a selector to get the root element

```vue
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations'
import { ref } from 'vue'

const list = ref([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

useSortable('#dv', list, {
  handle: '.handle'
})
</script>

<template>
  <div id="dv">
    <div v-for="item in list" :key="item.id">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
```

### Tips

If you want to handle the onUpdate yourself, you can pass in onUpdate parameters, and we also exposed a function to move the item position.

```ts
import { moveArrayElement } from '@vueuse/integrations/useSortable'

useSortable(el, list, {
  onUpdate: (e) => {
    // do something
    moveArrayElement(list.value, e.oldIndex, e.newIndex)
    // do something
  }
})
```
