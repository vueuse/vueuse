# useRouteQuery

> Shorthand for reactive route.query 

## Usage

```ts
import { useRouteQuery } from '@vueuse/router'

const search = useRouteQuery('search')

console.log(search.value) // route.query.search
search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })
```
