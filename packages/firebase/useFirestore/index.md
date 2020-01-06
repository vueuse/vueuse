📦 this function is available in [`@vueuse/firebase`]()

# useFirestore

> Creates realtime bindings between a [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore) and your Vue application. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useFirestore } from '@vueuse/core'

const db = firebase.initializeApp({ projectId: 'MY PROJECT ID' }).firestore()

const todos = useFirestore(db.collection('todos'))
const user = useFirestore(db.collection('users').doc('my-user-id'))
```
