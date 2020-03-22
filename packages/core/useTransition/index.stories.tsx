import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useTransition } from '.'

type Inject = {
  baseNumber: number
  number: number
}

const rand = () => Math.floor(Math.random() * (1000 - 0) + 0)

const Demo = createComponent({
  setup() {
    const baseNumber = ref(rand())

    const number = useTransition(baseNumber, {
      duration: 1000,
      transition: 'easeInOutExpo',
    })

    return {
      baseNumber,
      number,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    const onClick = () => {
      this.baseNumber = rand()
    }

    return (
      <div>
        <div id='demo'>
          <button onClick={onClick}>
            Change number
          </button>
          <p>Base number: <b>{this.baseNumber}</b></p>
          <p>Transitioned number: <b>{Math.round(this.number)}</b></p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useTransition', () => Demo as any)
