import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useStoragePlain } from '.'

const Demo = createComponent({
  setup () {
    const store = useStoragePlain('vue-use-locale-storage-plain', 'Hello, this message will persist.')

    return {
      store,
    }
  },

  render (this: Vue & {store: string }) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <span>The following message will persist</span>
          <input v-model={this.store} type='text'/>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State|useStoragePlain', module)
  .add('Demo & Docs', () => Demo as any)
