import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from '../api'
import { ShowDocs } from '../_docs/showdocs'

const Demo = defineComponent({
  render(this: Vue & any) {
    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./README.md')} />

    return (
      <div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|Firebase', module)
  .add('Read Me', () => Demo as any)
