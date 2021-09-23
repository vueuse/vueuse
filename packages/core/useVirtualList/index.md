---
category: Component
---

# useVirtualList

Composable virtual list. It allows you to display a large list of items while only rendering visible ones on the screen.

## Usage

```typescript
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  Array.from(Array(99999).keys()),
  {
    itemHeight: 22,
  },
)
```

```html
<template>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index">
        Row: {{ item.data }}
      </div>
    </div>
  </div>
</template>
```

## Component

```html
<UseVirtualList :list="list" :options="options" height="300px">
  <template #="props">
    <!-- you can get current item of list here -->
    Row {{ props.data }}
  </template>
</UseVirtualList>
```
