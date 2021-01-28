---
category: '@Router'
---

# useRouteQuery

Shorthand for reactive route.query

## Usage

```ts
import { useRouteQuery } from '@vueuse/router'

const search = useRouteQuery('search')

console.log(search.value) // route.query.search
search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useRouteQuery(
  name: string
): Ref<null | string | string[]>
export declare function useRouteQuery<
  T extends null | string | string[] = null | string | string[]
>(name: string, defaultValue?: T, options?: ReactiveRouteOptions): Ref<T>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/router/useRouteQuery/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/router/useRouteQuery/index.md)


<!--FOOTER_ENDS-->
