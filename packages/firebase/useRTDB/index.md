---
category: '@Firebase'
---

<!--DEMO_STARTS--><!--DEMO_ENDS-->

<!--HEAD_STARTS-->
::: tip
available in add-on [`@vueuse/firebase`](/firebase/)
:::

<!--HEAD_ENDS-->


# useRTDB

> Reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js
import firebase from 'firebase/app'
import 'firebase/database'
import { useRTDB } from '@vueuse/firebase'

const db = firebase
  .initializeApp({ databaseURL: 'https://MY-DATABASE.firebaseio.com' })
  .database()

// in setup()
const todos = useRTDB(db.ref('todos'))
```

## Share across instances

You can reuse the firebase reference by using [`createGlobalState`](https://vueuse.js.org/?path=/story/state--createglobalstate) from the core package

```js
// store.js
import { createGlobalState } from '@vueuse/core'
import { useRTDB } from '@vueuse/firebase'

export const useTodos = createGlobalState(
  () => useRTDB(db.ref('todos')),
)
```

```js
// app.js
import { useTodos } from './store'

new Vue({
  setup() {
    const todos = useTodos()
    return { todos }
  },
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive Firebase Realtime Database binding.
 *
 * @see   {@link https://vueuse.js.org/useRTDB}
 * @param docRef
 */
export declare function useRTDB<T = any>(
  docRef: firebase.database.Reference
): Ref<T | undefined>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/firebase/useRTDB/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/firebase/useRTDB/index.md)


<!--FOOTER_ENDS-->