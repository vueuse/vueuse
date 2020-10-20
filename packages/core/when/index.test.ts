import { ref } from 'vue-demi'
import { when } from '.'
import { renderHook } from '../../_docs/tests'
import { invoke } from '@vueuse/shared'

describe('when', () => {
  it('should work', (done) => {
    renderHook(() => {
      const r = ref(0)

      invoke(async() => {
        expect(r.value).toBe(0)
        await when(r).toBe(1)
        expect(r.value).toBe(1)
        done()
      })

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should work for changedTimes', (done) => {
    renderHook(() => {
      const r = ref(0)

      invoke(async() => {
        expect(r.value).toBe(0)
        await when(r).changedTimes(3)
        expect(r.value).toBe(3)
        done()
      })

      setTimeout(() => {
        r.value = 1
        r.value = 2
        r.value = 3
      }, 100)
    })
  })

  it('should support `not`', (done) => {
    renderHook(() => {
      const r = ref(0)

      invoke(async() => {
        expect(r.value).toBe(0)
        await when(r).not.toBe(0)
        expect(r.value).toBe(1)
        done()
      })

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })
})
