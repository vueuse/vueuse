---
category: '@Router'
---

# useRouteParams

Shorthand for a reactive `route.params`.

## Usage

```ts
import { useRouteParams } from '@vueuse/router'

const userId = useRouteParams('userId')

const userId = useRouteParams('userId', '-1') // or with a default value

const userId = useRouteParams('page', '1', { transform: Number }) // or transforming value

console.log(userId.value) // route.params.userId
userId.value = '100' // router.replace({ params: { userId: '100' } })
```

The route params can be cleared by passing `''`.

```ts
import { useRouteParams } from '@vueuse/router'

// https://www.example.com/users/123
const userId = useRouteParams('userId')

userId.value = '' // https://www.example.com/users/
```

The route params can also be cleared by passing `null` or `undefined`, only if route name is available.

```ts
const router = createRouter({
  routes: [
    // Can be cleared by '' only
    { path: '/:users?', component: { template: '<div>Users</div>' } },
    // Can be cleared by '', null, undefined
    { name: 'User', path: '/:users?', component: { template: '<div>Users</div>' } },
  ],
})
```
