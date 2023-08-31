import type { Ref } from 'vue-demi'
import { effectScope, ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { promiseTimeout } from '../utils'
import { autoResetRef, refAutoReset } from '.'

describe('refAutoReset', () => {
  it('should be defined', () => {
    expect(refAutoReset).toBeDefined()
    expect(autoResetRef).toBeDefined()
  })

  it('should be default at first', () => {
    const val = refAutoReset('default', 100)
    expect(val.value).toBe('default')
  })

  it('should be updated', () => {
    const val = refAutoReset('default', 100)

    val.value = 'update'
    expect(val.value).toBe('update')
  })

  it('should be reset', async () => {
    const val = refAutoReset('default', 100)
    val.value = 'update'

    await new Promise(resolve => setTimeout(resolve, 100 + 1))
    expect(val.value).toBe('default')
  })

  it('should be reset with maybeRef', async () => {
    const val = refAutoReset(() => [123], () => 10)
    val.value = [999]
    expect(val.value).toEqual([999])
    await new Promise(resolve => setTimeout(resolve, 11))
    expect(val.value).toEqual([123])
  })

  it('should change afterMs', async () => {
    const afterMs = ref(150)
    const val = refAutoReset('default', afterMs)
    val.value = 'update'
    afterMs.value = 100

    await new Promise(resolve => setTimeout(resolve, 100 + 1))
    expect(val.value).toBe('update')

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(val.value).toBe('default')

    val.value = 'update'

    await new Promise(resolve => setTimeout(resolve, 100 + 1))
    expect(val.value).toBe('default')
  })

  it('should not reset when scope dispose', async () => {
    let val: Ref<string> = ref('')
    const scope = effectScope()

    scope.run(() => {
      val = refAutoReset('default', 100)
      val.value = 'update'
    })

    scope.stop()
    await promiseTimeout(100)
    expect(val.value).toBe('update')
  })
})
