import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useShare } from '.'

const Demo = defineComponent({
  setup() {
    const share = () => useShare({ title: 'Hello', text: 'Hello my friend!', url: location.href })

    return {
      share,
    }
  },

  render(this: Vue & any) {
    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo" ref="demo">
          <button onClick={this.share}>Share</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useShare', () => Demo as any)
