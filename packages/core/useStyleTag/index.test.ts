import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useStyleTag } from './index'

describe('useStyleTag', () => {
  it('should create a style element', async () => {
    const { isLoaded } = useStyleTag('body { color: red; }', { id: 'test-1' })

    await nextTick()

    expect(isLoaded.value).toBe(true)
    const el = document.getElementById('test-1') as HTMLStyleElement
    expect(el).not.toBeNull()
    expect(el.textContent).toBe('body { color: red; }')
  })

  it('should update css when ref changes', async () => {
    const css = shallowRef('body { color: red; }')
    useStyleTag(css, { id: 'test-2' })

    await nextTick()
    expect(document.getElementById('test-2')?.textContent).toBe('body { color: red; }')

    css.value = 'body { color: blue; }'
    await nextTick()
    expect(document.getElementById('test-2')?.textContent).toBe('body { color: blue; }')
  })

  it('should remove style element on unload', async () => {
    const { unload, isLoaded } = useStyleTag('body { color: red; }', { id: 'test-3' })

    await nextTick()
    expect(document.getElementById('test-3')).not.toBeNull()

    unload()
    expect(isLoaded.value).toBe(false)
    expect(document.getElementById('test-3')).toBeNull()
  })

  it('should not error when unload is called twice', async () => {
    const { unload } = useStyleTag('body { color: red; }', { id: 'test-4' })

    await nextTick()
    unload()
    expect(() => unload()).not.toThrow()
  })

  it('should not error when unload is called without load', () => {
    const { unload } = useStyleTag('body { color: red; }', { id: 'test-5', manual: true })

    expect(() => unload()).not.toThrow()
  })

  it('should keep style element when two instances share the same id and only one unmounts', async () => {
    const scope1 = effectScope()
    const scope2 = effectScope()

    await nextTick()

    scope1.run(() => {
      useStyleTag('body { color: red; }', { id: 'shared-test' })
    })

    await nextTick()

    scope2.run(() => {
      useStyleTag('body { color: blue; }', { id: 'shared-test' })
    })

    await nextTick()
    expect(document.getElementById('shared-test')).not.toBeNull()

    // First scope unmounts - element should still exist (scope2 still holds it)
    scope1.stop()
    expect(document.getElementById('shared-test')).not.toBeNull()

    // Second scope unmounts - last reference, element should be removed
    scope2.stop()
    expect(document.getElementById('shared-test')).toBeNull()
  })

  it('should not error when one component unloads and the other stays loaded with shared id', async () => {
    const scope1 = effectScope()
    const scope2 = effectScope()
    const css2 = shallowRef('body { color: blue; }')

    scope1.run(() => {
      useStyleTag('body { color: red; }', { id: 'shared-test-2' })
    })

    scope2.run(() => {
      useStyleTag(css2, { id: 'shared-test-2' })
    })

    await nextTick()

    // First scope unmounts - element should still exist
    scope1.stop()
    expect(document.getElementById('shared-test-2')).not.toBeNull()

    // Second scope is still active, should not error
    expect(() => scope2.stop()).not.toThrow()
    expect(document.getElementById('shared-test-2')).toBeNull()
  })

  it('should create element with media attribute', async () => {
    useStyleTag('body { color: red; }', { id: 'test-media', media: 'print' })

    await nextTick()
    const el = document.getElementById('test-media') as HTMLStyleElement
    expect(el).not.toBeNull()
    expect(el.media).toBe('print')
  })

  it('should not create element when manual is true', async () => {
    const { load, isLoaded } = useStyleTag('body { color: red; }', { id: 'test-manual', manual: true })

    await nextTick()
    expect(isLoaded.value).toBe(false)
    expect(document.getElementById('test-manual')).toBeNull()

    load()
    expect(isLoaded.value).toBe(true)
    expect(document.getElementById('test-manual')).not.toBeNull()
  })

  it('should not create element when immediate is false', async () => {
    const { isLoaded } = useStyleTag('body { color: red; }', { id: 'test-no-immediate', immediate: false })

    await nextTick()
    expect(isLoaded.value).toBe(false)
    expect(document.getElementById('test-no-immediate')).toBeNull()
  })
})
