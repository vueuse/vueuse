import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useFirestore } from '.'

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: 'vueuse',
    databaseURL: 'https://vueuse-rtdb.firebaseio.com',
  })
}

const db = firebase.firestore()

const Demo = createComponent({
  setup() {
    return {
      todos: useFirestore(db.collection('todos')),
      user: useFirestore(db.collection('users').doc('ctTVGl9swtW9ghhG7vj6')),
    }
  },

  render(this: Vue & any) {
    const {
      todos,
      user,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <note>Todos</note>
          <pre>{JSON.stringify(todos, null, 2)}</pre>
          <br></br>
          <note>User</note>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|Firebase', module)
  .add('useFirestore', () => Demo as any)
