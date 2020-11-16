import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useClipboard, usePermission } from '..'

defineDemo(
  {
    name: 'useClipboard',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        ...useClipboard(),
        permissionRead: usePermission('clipboard-read'),
        permissionWrite: usePermission('clipboard-write'),
        input: ref(''),
      }
    },

    template: html`
      <div v-if='isSupported'>
        <note>Clipboard Permission: read <b>{{permissionRead}}</b> | write <b>{{permissionWrite}}</b></note>
        <p>Current copied: <code>{{text || 'none'}}</code></p>
        <input v-model="input" type="text"/>
        <button @click="copy(input)">Copy</button>
      </div>
      <p v-else>
        Your browser does not support Clipboard API
      </p>
    `,
  }),
)
