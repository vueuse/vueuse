import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useShare } from '.'

const Demo = createComponent({
  setup() {
    return {
      useShare
    }
  },

  render(this: Vue & any) {
    const {
      useShare
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo' ref='demo'>
          <button onClick={() => useShare({ title: 'Hello', text: 'Hello my friend!', url: location.href })}>Share</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useShare', () => Demo as any)
