import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { usePreferredLanguages } from '.'

const Demo = defineComponent({
  setup() {
    return {
      usePreferredLanguages: usePreferredLanguages(),
    }
  },

  render(this: Vue & any) {
    const {
      usePreferredLanguages,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <p>Preferred Languages: <code>{usePreferredLanguages.join(', ')}</code></p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('usePreferredLanguages', () => Demo as any)
