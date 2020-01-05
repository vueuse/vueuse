import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, computed } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useNow } from '../useNow'
import { useIdle } from '.'

type Inject = {
  idle: boolean
  lastActive: number
  idledFor: number
}

const Demo = createComponent({
  setup () {
    const { idle, lastActive } = useIdle(5000, false, undefined, 20)
    const now = useNow()

    const idledFor = computed(() => {
      return Math.floor((now.value - lastActive.value) / 1000)
    })

    return { idle, lastActive, now, idledFor }
  },

  render (this: Vue & Inject) {
    const { idle, idledFor } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')}/>

    return (
      <div>
        <div id='demo'>
          <note>For demonstraction purpose, the idle timer is set to <b>5s</b>.</note>
          <p>Idle: {idle.toString()}</p>
          <p>Inactive: {idledFor}s</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useIdle', () => Demo as any)
