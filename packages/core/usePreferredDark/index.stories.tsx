import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { usePreferredDark } from '.'

const Demo = createComponent({
  setup() {
    return {
      prefersDark: usePreferredDark(),
    }
  },

  render(this: Vue & any) {
    const {
      prefersDark,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Prefers Dark: {prefersDark.toString()}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('usePreferredDark', () => Demo as any)
