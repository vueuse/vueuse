import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { usePageLeave } from '.'

const Demo = defineComponent({
  setup() {
    return {
      isLeft: usePageLeave(),
    }
  },

  render(this: Vue & any) {
    const {
      isLeft,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <pre lang="json">{
            JSON.stringify({
              isLeft,
            }, null, 2)
          }</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('usePageLeave', () => Demo as any)
