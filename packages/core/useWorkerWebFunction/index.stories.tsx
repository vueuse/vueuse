import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useWebWorkerFunction } from './'
import { useRaf } from '../useRaf'
import { computed } from '@vue/composition-api'

type Inject = {
  baseSort: Function
  workerSort: Function
  rotationDegrees: number
}

const numbers = Array(5000000).fill(1).map(ele => ~~(Math.random() * 1000000))
const sortNumbers = nums => nums.sort()

const Demo = createComponent({
  setup() {
    const { workerHook } = useWebWorkerFunction(sortNumbers)
    const time = useRaf()
    const rotationDegrees = computed(() => (time.value / 50) % 360)

    const baseSort = () => sortNumbers(numbers)
    const workerSort = () => workerHook(numbers)

    return {
      baseSort,
      workerSort,
      rotationDegrees,
    }
  },

  render(this: Vue & Inject) {
    const { baseSort, workerSort, rotationDegrees } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <div style={{ height: '300px', width: '300px' }}>
            <img
              style={{ transform: `rotate(${rotationDegrees}deg)` }}
              src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-storybook.png"
            ></img>
          </div>
          <button onClick={() => baseSort()}>
            Normal Sort
          </button>
          <button onClick={() => workerSort()}>
            Worker Sort
          </button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Misc', module).add('useWebWorkerFunction', () => Demo as any)
