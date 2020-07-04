import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { usePreferredColorScheme } from '.'

const Demo = defineComponent({
  setup() {
    return {
      preferredColorScheme: usePreferredColorScheme(),
    }
  },

  render(this: Vue & any) {
    const {
      preferredColorScheme,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Preferred Color Scheme: {preferredColorScheme.toString()}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('usePreferredColorScheme', () => Demo as any)
