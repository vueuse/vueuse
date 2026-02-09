import { describe, expect, it } from 'vitest'
import { useSetup } from '../../.test'
import { useMounted } from './index'

describe('useMounted', () => {
  it('should be defined', () => {
    expect(useMounted).toBeDefined()
  })

  it('should return true after mount', () => {
    const vm = useSetup(() => {
      const isMounted = useMounted()
      return { isMounted }
    })

    expect(vm.isMounted).toBe(true)
    vm.unmount()
  })

  it('should be awaitable', async () => {
    let resolved = false

    const vm = useSetup(() => {
      const isMounted = useMounted()

      ;(async () => {
        const result = await isMounted
        resolved = true
        expect(result).toBe(true)
      })()

      return { isMounted }
    })

    // The promise resolves via microtask after mount
    await new Promise(r => setTimeout(r, 0))
    expect(resolved).toBe(true)
    vm.unmount()
  })

  it('should support .then()', async () => {
    const vm = useSetup(() => {
      const isMounted = useMounted()
      return { isMounted }
    })

    const result = await vm.isMounted
    expect(result).toBe(true)
    vm.unmount()
  })

  it('should resolve with false when no instance', async () => {
    const isMounted = useMounted()
    expect(isMounted.value).toBe(false)

    const result = await isMounted
    expect(result).toBe(false)
  })
})
