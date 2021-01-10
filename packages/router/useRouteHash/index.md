---
category: '@Router'
---

<!--DEMO_STARTS--><!--DEMO_ENDS-->

<!--HEAD_STARTS-->
::: tip
available in add-on [`@vueuse/router`](/router/)
:::

<!--HEAD_ENDS-->

# useRouteHash

> Shorthand for reactive route.hash 

## Usage

```ts
import { useRouteHash } from '@vueuse/router'

const search = useRouteHash()

console.log(search.value) // route.hash
search.value = 'foobar' // router.replace({ hash: 'foobar' })
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useRouteHash(
  defaultValue?: string,
  { mode, route, router }?: ReactiveRouteOptions
): WritableComputedRef<string>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/router/useRouteHash/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/router/useRouteHash/index.md)


<!--FOOTER_ENDS-->