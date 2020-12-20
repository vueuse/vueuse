import { useSetup } from '../../_tests'
import { useNProgress } from './index'
import { nextTick } from 'vue-demi'
import nprogress from 'nprogress'

describe('useNProgress', () => {
  it('should be defined', () => {
    expect(useNProgress).toBeDefined()
  })

  it('should start state as false', () => {
    useSetup(() => {
      const { isLoading } = useNProgress()

      expect(isLoading.value).toBeFalsy()
    })
  })

  it('should start state as true', () => {
    const instance = useSetup(() => {
      return useNProgress(0.1)
    })

    expect(instance.isLoading).toBeTruthy()
    expect(instance.progress).toBe(0.1)
  })

  it('should track the manual progress', async() => {
    const setProgress = jest.spyOn(nprogress, 'set')
    const instance = useSetup(() => {
      return useNProgress()
    })

    expect(instance.isLoading).toBeFalsy()

    instance.progress = 0.0
    await nextTick()
    expect(setProgress).toBeCalledWith(0.0)
    expect(instance.isLoading).toBeTruthy()

    setProgress.mockClear()

    instance.progress = 1.0
    await nextTick()
    expect(setProgress).toBeCalledWith(1.0)
    expect(instance.isLoading).toBeFalsy()
  })

  it('should update progress state', async() => {
    const startProgress = jest.spyOn(nprogress, 'start')
    const instance = useSetup(() => {
      return useNProgress()
    })

    expect(instance.isLoading).toBeFalsy()

    instance.isLoading = true
    await nextTick()
    expect(startProgress).toBeCalled()
  })

  it('should start progress bar', () => {
    useSetup(() => {
      const startProgress = jest.spyOn(nprogress, 'start')
      const { start, isLoading } = useNProgress()

      expect(isLoading.value).toBeFalsy()
      start()
      expect(startProgress).toBeCalled()
      expect(isLoading.value).toBeTruthy()
    })
  })

  it('should done and remove progress bar', () => {
    useSetup(() => {
      const setProgress = jest.spyOn(nprogress, 'set')
      const { done, isLoading } = useNProgress(0)

      expect(isLoading.value).toBeTruthy()
      done()
      expect(setProgress).toBeCalledWith(1)
      expect(isLoading.value).toBeFalsy()
    })
  })

  it('should remove and remove progress bar', async() => {
    const removeProgress = jest.spyOn(nprogress, 'remove')
    const instance = useSetup(() => {
      return useNProgress(0)
    })

    expect(instance.isLoading).toBeTruthy()
    instance.remove()
    await nextTick()
    expect(removeProgress).toBeCalled()
    expect(instance.isLoading).toBeFalsy()
  })
})
