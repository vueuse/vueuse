import { nextTick, ref } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { watchKeepAlive } from '.'

describe('watchKeepAlive', () => {
  it('should work when nested value is updated', async () => {
    const expectedValue = 10

    const obj = ref(0)
    const spy = vi.fn((objectUpdate) => {
      expect(objectUpdate).toEqual(expectedValue)
    })

    const wrapper = mount({
      components: {
        CompA: {
          setup() {
            watchKeepAlive(obj, spy)
          },
        },
      },
      template: `
        <keep-alive>
          <CompA />
        </keep-alive>
      `,
    })

    obj.value = expectedValue
    await nextTick()

    expect(spy).toBeCalledTimes(1)
  })
})
