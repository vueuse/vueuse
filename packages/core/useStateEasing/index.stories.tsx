import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useStateEasing } from '.'

type Inject = {
  baseNumber: number
  number: number
}

const rand = () => Math.floor(Math.random() * (1000000000 - 0) + 0);

const Demo = createComponent({
  setup() {
    const baseNumber = ref(rand());

    const number = useStateEasing(baseNumber, {
      duration: 500,
      easing: 'easeInOutCubic',
    });

    return {
      baseNumber,
      number
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
          <p>Base number: <b>{this.baseNumber.toLocaleString()}</b></p>
          <p>Transitioned number: <b>{this.number.toLocaleString()}</b></p>
        </div>
        {Docs}
      </div>
    )
  }
})

storiesOf('State', module)
  .add('useStateEasing', () => Demo as any)
