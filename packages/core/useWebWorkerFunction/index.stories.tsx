import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useWebWorkerFunction } from './'
import { useRafFn } from '../useRafFn'
import { computed } from '@vue/composition-api'

type Inject = {
  baseSort: Function
  workerSort: Function
  rotationDegrees: number
}

const numbers: number[] = Array(5000000).fill(1).map(ele => ~~(Math.random() * 1000000))
const sortNumbers = (nums: number[]): number[] => nums.sort()

const Demo = createComponent({
  setup() {
    const { workerHook } = useWebWorkerFunction(sortNumbers)
    const count = ref(0)
    useRafFn(() => {
      count.value += 1
    })
    // Spin 360 degrees after 1000 Rafs
    const rotationDegrees = computed(() => (count.value / 1000) * 360)

    const baseSort = () => {
      const data = sortNumbers(numbers)
      console.log('Array sorted', data.slice(0, 10))
    }
    const workerSort = async() => {
      const data = await workerHook(numbers)
      console.log('Array sorted', data.slice(0, 10))
    }

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
