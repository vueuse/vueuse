---
category: Utilities
---

# usePagination

reactive pagination.

## Usage

```ts
function fetchData({ currentPage, currentPageSize }: { currentPage: number; currentPageSize: number }) {
  fetch(currentPage, currentPageSize).then((responseData) => {
    data.value = responseData
  })
}

const {
  currentPage,
  currentPageSize,
  pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = usePagination(
  {
    total: database.value.length,
    page: 1,
    pageSize,
    onPageChange: fetchData,
    onPageSizeChange: fetchData,
  },
)
```


## Component 

```html
<UsePagination
  v-slot="{
    currentPage,
    currentPageSize,
    next,
    prev,
    pageCount,
    isFirstPage,
    isLastPage
  }"
  :total="database.length"
  @page-change="fetchData"
  @page-size-change="fetchData"
>
  <div class="inline-grid grid-cols-2 gap-x-4 gap-y-2 items-center">
    <div opacity="50">
      total:
    </div>
    <div>{{ database.length }}</div>
    <div opacity="50">
      pageCount:
    </div>
    <div>{{ pageCount }}</div>
    <div opacity="50">
      currentPageSize:
    </div>
    <div>{{ currentPageSize }}</div>
    <div opacity="50">
      currentPage:
    </div>
    <div>{{ currentPage }}</div>
    <div opacity="50">
      isFirstPage:
    </div>
    <div>{{ isFirstPage }}</div>
    <div opacity="50">
      isLastPage:
    </div>
    <div>{{ isLastPage }}</div>
  </div>
  <div>
    <button :disabled="isFirstPage" @click="prev">
      prev
    </button>
    <button :disabled="isLastPage" @click="next">
      next
    </button>
  </div>
</UsePagination>
```

Component event supported props event callback and event listener.

event listener:
```html
<UsePagination
  v-slot="{
    currentPage,
    currentPageSize,
    next,
    prev,
    pageCount,
    isFirstPage,
    isLastPage
  }"
  :total="database.length"
  @page-change="fetchData"
  @page-size-change="fetchData"
  @page-count-change="onPageCountChange"
>
  <!-- your code -->
</UsePagination>
```
or props event callback:
```html
<UsePagination
  v-slot="{
    currentPage,
    currentPageSize,
    next,
    prev,
    pageCount,
    isFirstPage,
    isLastPage
  }"
  :total="database.length"
  :on-page-change="fetchData"
  :on-page-size-change="fetchData"
  :on-page-count-change="onPageCountChange"
>
  <!-- your code -->
</UsePagination>
```