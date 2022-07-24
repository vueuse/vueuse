---
category: State
related: useLocalStorage, useSessionStorage, useStorageAsync
---

# useStorage

Reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

::: tip
When using with Nuxt 3, this functions will **NOT** be auto imported in favor of Nitro's built-in [`useStorage()`](https://nitro.unjs.io/guide/storage.html). Use explicit import if you want to use the function from VueUse.
:::

## Usage

```js
import { useStorage } from '@vueuse/core'

// bind object
const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' })

// bind boolean
const flag = useStorage('my-flag', true) // returns Ref<boolean>

// bind number
const count = useStorage('my-count', 0) // returns Ref<number>

// bind string with SessionStorage
const id = useStorage('my-id', 'some-string-id', sessionStorage) // returns Ref<string>

// delete data from storage
state.value = null
```

## Custom Serialization

By default, `useStorage` will smartly use the corresponding serializer based on the data type of provided default value. For example, `JSON.stringify` / `JSON.parse` will be used for objects, `Number.toString` / `parseFloat` for numbers, etc.

You can also provide your own serialization function to `useStorage`:

```ts
import { useStorage } from '@vueuse/core'

useStorage(
  'key',
  {},
  undefined,
  {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    },
  },
)
```

Please note when you provide `null` as the default value, `useStorage` can't assume the data type from it. In this case, you can provide a custom serializer or reuse the built-in ones explicitly.

```ts
import { StorageSerializers, useStorage } from '@vueuse/core'

const objectLike = useStorage('key', null, undefined, { serializer: StorageSerializers.object })
objectLike.value = { foo: 'bar' }
```
