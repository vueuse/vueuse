import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { usePermission } from '../usePermission'
import { useClipboard } from '.'

const Demo = createComponent({
  setup () {
    return {
      ...useClipboard(),
      permissionRead: usePermission('clipboard-read'),
      permissionWrite: usePermission('clipboard-write'),
      input: ref(''),
    }
  },

  render (this: Vue & any) {
    const {
      text,
      copy,
      supported,
      permissionRead,
      permissionWrite,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        { supported ? (
          <div id='demo'>
            <note>Clipboard Permission: read <b>{permissionRead}</b> | write <b>{permissionWrite}</b></note>
            <p>Current copied: <code>{text || 'none'}</code></p>
            <input v-model={this.input} type='text'/>
            <button onClick={() => copy(this.input)} >Copy</button>
          </div>
        ) : (
          <div id='demo'>
            <p>Your browser does not support Clipboard API</p>
          </div>
        )}
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useClipboard', () => Demo as any)
