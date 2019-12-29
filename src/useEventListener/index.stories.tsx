import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'

const Demo = createComponent({
  render (this: Vue & any) {
    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        {Docs}
      </div>
    )
  },
})
storiesOf('Browser', module)
  .add('useEventListener', () => Demo as any)
