import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useOnline } from '.'

const Demo = createComponent({
  setup () {
    const online = useOnline()

    return {
      online,
    }
  },

  render (this: Vue & {online: boolean}) {
    const { online } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>{ online ? 'Online' : 'Offline'}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useOnline', () => Demo as any)
