import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useStoragePlain } from '.'

const Demo = defineComponent({
  setup() {
    const store = useStoragePlain('vue-use-locale-storage-plain', 'Hello World!')

    return {
      store,
    }
  },

  render(this: Vue & {store: string }) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <note>The following message will persist</note>
          <input v-model={this.store} type="text"/>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useStoragePlain', () => Demo as any)
