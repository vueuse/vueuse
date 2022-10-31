import type { Ref } from 'vue-demi'
import { effectScope, ref } from 'vue-demi'
import { promiseTimeout } from '../utils'
import { createEventHook } from '../createEventHook'
import { refResetOn } from '.'

describe('refResetOn', () => {
  it('should be defined', () => {
    expect(refResetOn).toBeDefined()
    expect(refResetOn).toBeDefined()
  })

  it('should be default at first', () => {
    const { on } = createEventHook()
    const val1 = refResetOn('default', on)
    const val2 = refResetOn(() => ({ key: 'default' }), on)

    expect(val1.value).toBe('default')
    expect(val2.value).toEqual({ key: 'default' })
  })

  it('should be updated', () => {
    const { on } = createEventHook()
    const val1 = refResetOn('default', on)
    const val2 = refResetOn(() => ({ key: 'default' }), on)

    val1.value = 'update'
    val2.value.key = 'update'
    expect(val1.value).toBe('update')
    expect(val2.value).toEqual({ key: 'update' })
  })

  it('should be reset', async () => {
    const { on, trigger } = createEventHook()
    const val1 = refResetOn('default', on)
    const val2 = refResetOn(() => ({ key: 'default' }), on)
    val1.value = 'update'
    val2.value.key = 'update'

    trigger('any')

    expect(val1.value).toBe('default')
    expect(val2.value).toEqual({ key: 'default' })
  })

  it('should not reset when scope dispose', async () => {
    let val: Ref<string> = ref('')
    const { on, trigger } = createEventHook()
    const scope = effectScope()

    scope.run(() => {
      val = refResetOn('default', on)
      val.value = 'update'
    })

    scope.stop()
    trigger('any')
    expect(val.value).toBe('update')
  })
})
