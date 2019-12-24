import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useLocalStoragePlain } from '.'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const store = useLocalStoragePlain('vue-use-locale-storage-plain', 'Hello, this message will persist.')

    return {
      store,
    }
  },

  render (this: Vue & {store: string }) {
    return (
      <div id='demo'>
        <input v-model={this.store} type='text'/>
      </div>
    )
  },
})

storiesOf('State|useLocalStoragePlain', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo as any)
