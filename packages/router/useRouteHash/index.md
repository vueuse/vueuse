---
category: '@Router'
---

# useRouteHash

Shorthand for reactive route.hash 

## Usage

```ts
import { useRouteHash } from '@vueuse/router'

const search = useRouteHash()

console.log(search.value) // route.hash
search.value = 'foobar' // router.replace({ hash: 'foobar' })
```
