---
category: '@Router'
---

# useRouteQuery

Shorthand for a reactive `route.query`.

## Usage

```ts
import { useRouteQuery } from '@vueuse/router'

const search = useRouteQuery('search')

const search = useRouteQuery('search', 'foo') // or with a default value

const page = useRouteQuery('page', '1', { transform: Number }) // or transforming value
const query = useRouteQuery({
  userId: 'default',
  page: '1'
}) // Get all query as object
console.log(search.value) // route.query.search
search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })
```
