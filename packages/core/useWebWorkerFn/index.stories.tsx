import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import dayjs from 'dayjs'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useWebWorkerFn, WorkerStatus } from './'
import { useNow } from '../useNow'

type Inject = {
  time: number
  baseSort: Function
  workerSort: Function
  workerStatus: string
  workerTerminate: Function
}

const numbers: number[] = [...Array(5000000)].map(_ => ~~(Math.random() * 1000000))
const sortNumbers = (nums: number[]): number[] => nums.sort()

const Demo = defineComponent({
  setup() {
    const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(sortNumbers)
    const time = useNow()

    const baseSort = () => {
      const data = sortNumbers(numbers)
      console.log('Normal sort (top 10 of 5000000)', data.slice(0, 10))
    }
    const workerSort = async() => {
      const data = await workerFn(numbers)
      console.log('Worker sort (top 10 of 5000000)', data.slice(0, 10))
    }

    return {
      time,
      baseSort,
      workerSort,
      workerStatus,
      workerTerminate,
    }
  },

  render(this: Vue & Inject) {
    const { baseSort, workerSort, time, workerStatus, workerTerminate } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <p>Current Time: {dayjs(time).format('YYYY-MM-DD HH:mm:ss SSS')}</p>
          <note>Open console to see the sorted result. Clock stops when UI blocking happends.</note>
          <button onClick={() => baseSort()}>
            Normal Sort
          </button>
          {
            workerStatus !== WorkerStatus.Runing ? (
              <button onClick={() => workerSort()}>
                Worker Sort
              </button>
            ) : (
              // @ts-ignore
              <button onClick={() => workerTerminate()} class='orange'>
                Terminate Worker
              </button>
            )
          }
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Misc', module).add('useWebWorkerFn', () => Demo as any)
