import { effectScope, nextTick, onScopeDispose, ref } from 'vue-demi'
import { conditionalScope } from '.'

describe('conditionalScope', () => {
  it('should works', async () => {
    const active = ref(false)
    let isDisposed = false

    conditionalScope(active, () => {
      onScopeDispose(() => {
        isDisposed = true
      })
    })

    active.value = false
    await nextTick()
    expect(isDisposed).toBe(true)
  })

  it('should be disposed based on its parent scope', () => {
    const active = ref(false)
    let isDisposed = false

    const currentScope = effectScope()

    currentScope.run(() => {
      conditionalScope(active, () => {
        onScopeDispose(() => {
          isDisposed = true
        })
      })
    })

    currentScope.stop()

    expect(isDisposed).toBe(true)
  })
})
