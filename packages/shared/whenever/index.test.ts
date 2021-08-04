import { nextTick, ref, unref } from 'vue-demi'
import { whenever } from '.'
import { useSetup } from '../../.test'

describe('whenever', () => {
  it('ignore falsy state change', async() => {
    // use a component to simulate normal use case
    const wrapper = useSetup(() => {
      const number = ref(1)
      const changeNumber = (v: number) => number.value = v
      const watchCount = ref(0)
      const callback = () => {
        watchCount.value += 1
      }

      whenever(number, callback)

      return {
        number,
        watchCount,
        changeNumber,
      }
    })

    expect(unref(wrapper.watchCount)).toEqual(0)

    wrapper.changeNumber(2)
    await nextTick()
    expect(unref(wrapper.watchCount)).toEqual(1)

    wrapper.changeNumber(0)
    await nextTick()
    expect(unref(wrapper.watchCount)).toEqual(1)

    wrapper.changeNumber(3)
    await nextTick()
    expect(unref(wrapper.watchCount)).toEqual(2)

    wrapper.unmount()
  })
})
