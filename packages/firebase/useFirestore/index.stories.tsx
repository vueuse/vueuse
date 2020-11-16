import 'firebase/firestore'
import firebase from 'firebase/app'
import { defineComponent } from 'vue-demi'
import { useFirestore } from '.'
import { defineDemo, html } from '../../_docs'

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: 'vueuse',
    databaseURL: 'https://vueuse-rtdb.firebaseio.com',
  })
}

const db = firebase.firestore()

defineDemo(
  {
    name: 'useFirestore',
    category: '/Firebase',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        todos: useFirestore(db.collection('todos')),
        user: useFirestore(db.collection('users').doc('ctTVGl9swtW9ghhG7vj6')),
      }
    },

    template: html`
      <div>
        <note>Todos</note>
        <pre>{{JSON.stringify(todos, null, 2)}}</pre>
        <br></br>
        <note>User</note>
        <pre>{{JSON.stringify(user, null, 2)}}</pre>
      </div>
    `,
  }),
)
