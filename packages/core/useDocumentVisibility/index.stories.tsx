import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref, watch } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useDocumentVisibility } from '.'
import { useTimeoutFn } from '../useTimeoutFn'

const Demo = defineComponent({
  setup() {
    const startMessage = 'Minimize this page and return'
    const message = ref(startMessage)
    const visibility = useDocumentVisibility()

    const timeout = useTimeoutFn(() => {
      message.value = startMessage
    }, 3000)

    watch(visibility, (current, previous) => {
      if (current === 'visible' && previous === 'hidden') {
        message.value = 'Welcome back!'
        timeout.start()
      }
    })

    return { message }
  },
  render(this: Vue & any) {
    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <h1>{this.message}</h1>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useDocumentVisibility', () => Demo as any)
