import { ref } from 'vue-demi'
import { when } from '.'
import { invoke } from '@vueuse/shared'

describe('when', () => {
  it('should work', (done) => {
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

  it('should work for changedTimes', (done) => {
<<<<<<< HEAD
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
=======
    const r = ref(0)

    invoke(async() => {
      expect(r.value).toBe(0)
      await when(r).changedTimes(3)
      expect(r.value).toBe(3)
      done()
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
    })

    setTimeout(() => {
      r.value = 1
      r.value = 2
      r.value = 3
    }, 100)
  })

  it('should support `not`', (done) => {
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

  it('should support toBeNull()', (done) => {
    const r = ref<number | null>(null)

    invoke(async() => {
      expect(r.value).toBe(null)
      await when(r).not.toBeNull()
      expect(r.value).toBe(1)
      done()
    })

    setTimeout(() => {
      r.value = 1
    }, 100)
  })

  it('should support array', (done) => {
    const r = ref<number[]>([1, 2, 3])

    invoke(async() => {
      expect(r.value).toEqual([1, 2, 3])
      await when(r).toContains(4, { deep: true })
      expect(r.value).toEqual([1, 2, 3, 4])
      done()
    })

    setTimeout(() => {
      r.value.push(4)
    }, 100)
  })

  it('should support array with not', (done) => {
    const r = ref<number[]>([1, 2, 3])

    invoke(async() => {
      expect(r.value).toEqual([1, 2, 3])
      await when(r).not.toContains(2, { deep: true })
      expect(r.value).toEqual([1])
      done()
    })

    setTimeout(() => {
      r.value.pop()
      r.value.pop()
    }, 100)
  })
})
