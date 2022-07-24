---
category: '@Router'
---

# useRouteHash

Shorthand for a reactive `route.hash`.

## Usage

```ts
import { useRouteHash } from '@vueuse/router'

const search = useRouteHash()

console.log(search.value) // route.hash
search.value = 'foobar' // router.replace({ hash: 'foobar' })
```
