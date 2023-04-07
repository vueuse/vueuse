---
category: Component
---

::: info
Please consider using [`vue-virtual-scroller`](https://github.com/Akryum/vue-virtual-scroller) if you are looking for more features.
:::


# useVirtualList

Create virtual lists with ease. Virtual lists (sometimes called [*virtual scrollers*](https://akryum.github.io/vue-virtual-scroller/)) allow you to render a large number of items performantly. They only render the minimum number of DOM nodes necessary to show the items within the `container` element by using the `wrapper` element to emulate the container element's full height.

## Usage

### Simple list

```typescript
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  Array.from(Array(99999).keys()),
  {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 22,
  },
)
```

### Config

| State      | Type     | Description                                                                                     |
|------------|----------|-------------------------------------------------------------------------------------------------|
| itemHeight | `number` | ensure that the total height of the `wrapper` element is calculated correctly.*                 |
| itemWidth  | `number` | ensure that the total width of the `wrapper` element is calculated correctly.*                  |
| overscan   | `number` | number of pre-rendered DOM nodes. Prevents whitespace between items if you scroll very quickly. |

\* The `itemHeight` or `itemWidth` must be kept in sync with the height of each row rendered. If you are seeing extra whitespace or jitter when scrolling to the bottom of the list, ensure the `itemHeight` or `itemWidth` is the same height as the row.

### Reactive list

```typescript
import { useVirtualList, useToggle } from '@vueuse/core'
import { computed } from 'vue'

const [isEven, toggle] = useToggle()
const allItems = Array.from(Array(99999).keys())
const filteredList = computed(() => allItems.filter(i => isEven.value ? i % 2 === 0 : i % 2 === 1))

const { list, containerProps, wrapperProps } = useVirtualList(
  filteredList,
  {
    itemHeight: 22,
  },
)
```

```html
<template>
  <p>Showing {{ isEven ? 'even' : 'odd' }} items</p>
  <button @click="toggle">Toggle Even/Odd</button>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index" style="height: 22px">
        Row: {{ item.data }}
      </div>
    </div>
  </div>
</template>
```

### Horizontal list

```typescript
import { useVirtualList } from '@vueuse/core'

const allItems = Array.from(Array(99999).keys())

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemWidth: 200,
  },
)
```

```html
<template>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index" style="width: 200px">
        Row: {{ item.data }}
      </div>
    </div>
  </div>
</template>
```

### Sticky Header


Puts the value returned from the `findStickyItem` method at the beginning of the `list`.

#### Param


- `items`:  `source.value.slice(0, state.value.start)`

- items between the source list and the visible list start

```html
  <div v-bind="containerProps" class="h-[500px] overflow-auto p-2 bg-gray-500/5 rounded">
      <template v-if="stickyItem">
        <div class="border border-$c-divider mb-2 sticky top-0 z-50 bg-red-300 text-white" :style="{
          height: `${stickyItem.data.height}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }">
          Row {{ stickyItem.index }} <span opacity="70" m="l-1">({{ stickyItem.data.size }})</span>
        </div>
      </template>
      <div v-bind="wrapperProps">
        <div v-for="{ index, data } in showedItems" :key="index" class="border border-$c-divider mb-2" :style="{
          height: `${data.height}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }">
          Row {{ index }} <span opacity="70" m="l-1">({{ data.size }})</span>
        </div>
      </div>
    </div>
```

```typescript

const showedItems = computed(() => {
  return list.value.filter(i => i.data.id != stickyItem.value.data.id);
})

const stickyItem = computed(() => {
  return list.value[0];
});

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  filteredItems,
  {
    findStickyItem: (items: any[]) => {
      return items.find((i: any) => i.index % 2 == 0)
    },
    itemHeight: i => (filteredItems.value[i].height + 8),
    overscan: 10,
  },
)

```


## Component Usage

```html
<UseVirtualList :list="list" :options="options" height="300px">
  <template #="props">
    <!-- you can get current item of list here -->
    <div style="height: 22px">Row {{ props.data }}</div>
  </template>
</UseVirtualList>
```

To scroll to a specific element, the component exposes `scrollTo(index: number) => void`.
