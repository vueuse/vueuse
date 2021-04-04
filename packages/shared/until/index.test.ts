import { ref } from 'vue-demi'
import { until } from '.'
import { invoke } from '@vueuse/shared'

describe('until', () => {
  it('should work', (done) => {
    const r = ref(0)

    invoke(async() => {
      expect(r.value).toBe(0)
      await until(r).toBe(1)
      expect(r.value).toBe(1)
      done()
    })

    setTimeout(() => {
      r.value = 1
    }, 100)
  })

  it('should work for changedTimes', (done) => {
    const r = ref(0)

    invoke(async() => {
      expect(r.value).toBe(0)
      await until(r).changedTimes(3)
      expect(r.value).toBe(3)
      done()
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
      await until(r).not.toBe(0)
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
      await until(r).not.toBeNull()
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
      await until(r).toContains(4, { deep: true })
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
      await until(r).not.toContains(2, { deep: true })
      expect(r.value).toEqual([1])
      done()
    })

    setTimeout(() => {
      r.value.pop()
      r.value.pop()
    }, 100)
  })
})
