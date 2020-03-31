import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useWebWorkerFn } from './'
import { useNow } from '../useNow'

type Inject = {
  baseSort: Function
  workerSort: Function
  time: number
}

const numbers: number[] = [...Array(5000000)].map(_ => ~~(Math.random() * 1000000))
const sortNumbers = (nums: number[]): number[] => nums.sort()

const Demo = createComponent({
  setup() {
    const { workerHook } = useWebWorkerFn(sortNumbers)
    const time = useNow()

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
      time,
    }
  },

  render(this: Vue & Inject) {
    const { baseSort, workerSort, time } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <div>{time}</div>
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

storiesOf('Misc', module).add('useWebWorkerFn', () => Demo as any)
