---
category: Sensors
---

# useVirtualList

Virtual list migrating from ahooks to Composition API.

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
  <div
    v-bind="containerProps"
    style="height: 300px;"
  >
    <div v-bind="wrapperProps">
      <div
        v-for="ele in list"
        :key="ele.index"
      >
        Row: {{ ele.data }}
      </div>
    </div>
  </div>
</template>
```

## Component

```html
<virtual-list :list="list" :options="options" height="300px">
  <template #default="props">
    <!-- you can get current item of list at here -->
    Row: {{ props.data }}
  </template>
</virtual-list>
```

## Type Declarations

```typescript
export interface UseVirtualListOptions {
  /**
   * item height, accept a pixel value or a function that returns the height
   *
   * @default 0
   */
  itemHeight: number | ((index: number) => number)
  /**
   * the extra buffer items outside of the view area
   *
   * @default 5
   */
  overscan?: number
}


export declare function useVirtualList<T = any>(list: T[], options: UseVirtualListOptions): {
  list: Ref<any>
  scrollTo: (index: number) => void
  containerProps: {
    ref: Ref<any>
    onScroll: () => void
    style: Partial<CSSStyleDeclaration>
  }
  wrapperProps: ComputedRef<{
    style: {
      width: string
      height: string
      marginTop: string
    }
  }>
}
```
