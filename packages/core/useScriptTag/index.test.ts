import { useScriptTag } from '.'
import { useSetup } from '../../_tests'

describe('useScriptTag', () => {
  const src = 'https://player.twitch.tv/js/embed/v1.js'

  const scriptTagElement = (): HTMLScriptElement | null =>
    document.head.querySelector(`script[src="${src}"]`)

  // Reset JSDOM after each test
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML
      = '<html><head></head><body>Empty DOM</body></html>'
  })

  it('should add script tag', async() => {
    const appendChildListener = jest.spyOn(document.head, 'appendChild')

    expect(appendChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    useSetup(() => {
      const [twitchTagElement] = useScriptTag(src, () => {}, { loadOnMounted: true })

      return {
        twitchTagElement,
      }
    })

    expect(appendChildListener).toBeCalled()

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)
  })

  /**
   * @jest-environment jsdom
   */
  it('should remove script tag on unmount', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const [twitchTagElement, twitchLoadScript, twitchUnloadScript] = useScriptTag(src, () => {}, { loadOnMounted: false })

      return {
        twitchTagElement,
        twitchLoadScript,
        twitchUnloadScript,
      }
    })

    await vm.twitchLoadScript(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    vm.unmount()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.twitchTagElement).toBeUndefined()
  })

  it('should remove script tag on unload call', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const [
        twitchTagElement,
        twitchLoadScript,
        twitchUnloadScript,
      ] = useScriptTag(src, () => {}, { loadOnMounted: false })

      return {
        twitchTagElement,
        twitchLoadScript,
        twitchUnloadScript,
      }
    })

    await vm.twitchLoadScript(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    await vm.twitchUnloadScript()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.twitchTagElement).toBeUndefined()
  })
})
