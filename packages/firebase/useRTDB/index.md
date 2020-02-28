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

You can reuse the firebase reference by using [`createGlobalState`](http://localhost:6006/?path=/story/state--createglobalstate) from the core package

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
