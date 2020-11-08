import 'firebase/database'
import firebase from 'firebase/app'
import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useRTDB } from '.'

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: 'vueuse',
    databaseURL: 'https://vueuse-rtdb.firebaseio.com',
  })
}

const db = firebase.database()

defineDemo(
  {
    name: 'useRTDB',
    category: '@Firebase',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        todos: useRTDB(db.ref('todos')),
      }
    },

    template: html`
      <div>
          <note>Todos</note>
          <pre>{{JSON.stringify(todos, null, 2)}}</pre>
      </div>
    `,
  }),
)
