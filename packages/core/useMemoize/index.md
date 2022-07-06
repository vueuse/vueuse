---
category: Utilities
---

# useMemoize

Cache results of functions depending on arguments and keep it reactive. It can also be used for asynchronous functions and will reuse existing promises to avoid fetching the same data at the same time.

::: tip
The results are not cleared automatically. Call `clear()` in case you no longer need the results or use own caching mechanism to avoid memory leaks.
:::

## Usage

```ts
import { useMemoize } from '@vueuse/core'

const getUser = useMemoize(
  async (userId: number): Promise<UserData> =>
    axios.get(`users/${userId}`).then(({ data }) => data),
)

const user1 = await getUser(1) // Request users/1
const user2 = await getUser(2) // Request users/2
// ...
const user1 = await getUser(1) // Retrieve from cache

// ...
const user1 = await getUser.load(1) // Request users/1

// ...
getUser.delete(1) // Delete cache from user 1
getUser.clear() // Clear full cache
```

Combine with `computed` or `asyncComputed` to achieve reactivity:

```ts
const user1 = asyncComputed(() => getUser(1))
// ...
await getUser.load(1) // Will also update user1
```

### Resolving cache key

The key for caching is determined by the arguments given to the function and will be serialized by default with `JSON.stringify`.
This will allow equal objects to receive the same cache key. In case you want to customize the key you can pass `getKey`

```ts
const getUser = useMemoize(
  async (userId: number, headers: AxiosRequestHeaders): Promise<UserData> =>
    axios.get(`users/${userId}`, { headers }).then(({ data }) => data),
  {
    // Use only userId to get/set cache and ignore headers
    getKey: (userId, headers) => userId,
  },
)
```

::: warning
For Vue 2 the key has to be a `string` or `number`
:::

### Customize cache mechanism
By default, the results are cached within a `Map` (normal object for Vue 2). You can implement your own mechanism by passing `cache` as options with following structure:
```ts
export interface MemoizeCache<Key, Value> {
  /**
   * Get value for key
   */
  get (key: Key): Value | undefined
  /**
   * Set value for key
   */
  set (key: Key, value: Value): void
  /**
   * Return flag if key exists
   */
  has (key: Key): boolean
  /**
   * Delete value for key
   */
  delete (key: Key): void
  /**
   * Clear cache
   */
  clear (): void
}
```
