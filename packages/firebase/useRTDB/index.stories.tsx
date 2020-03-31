import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import firebase from 'firebase/app'
import 'firebase/database'
import { defineComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useRTDB } from '.'

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: 'vueuse',
    databaseURL: 'https://vueuse-rtdb.firebaseio.com',
  })
}

const db = firebase.database()

const Demo = defineComponent({
  setup() {
    return {
      todos: useRTDB(db.ref('todos')),
    }
  },

  render(this: Vue & any) {
    const {
      todos,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <note>Todos</note>
          <pre>{JSON.stringify(todos, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|Firebase', module)
  .add('useRTDB', () => Demo as any)
