import { useSetup } from '../../.test'
import { useScriptTag } from '.'

describe('useScriptTag', () => {
  const src = 'https://code.jquery.com/jquery-3.5.1.min.js'

  const scriptTagElement = (): HTMLScriptElement | null =>
    document.head.querySelector(`script[src="${src}"]`)

  it('should add script tag', async() => {
    const appendChildListener = vitest.spyOn(document.head, 'appendChild')

    expect(appendChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    useSetup(() => {
      const { scriptTag } = useScriptTag(src, () => {}, { immediate: true })

      return {
        scriptTag,
      }
    })

    expect(appendChildListener).toBeCalled()

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)
  })

  it('should remove script tag on unmount', async() => {
    const removeChildListener = vitest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const { scriptTag, load, unload } = useScriptTag(src, () => {}, { immediate: false })

      return {
        scriptTag,
        load,
        unload,
      }
    })

    await vm.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    vm.unmount()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.scriptTag).toBeNull()
  })

  it('should remove script tag on unload call', async() => {
    const removeChildListener = vitest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const {
        scriptTag,
        load,
        unload,
      } = useScriptTag(src, () => {}, { immediate: false })

      return {
        scriptTag,
        load,
        unload,
      }
    })

    await vm.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    await vm.unload()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.scriptTag).toBeNull()
  })
})
