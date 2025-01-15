import type { AnyFn } from '@vueuse/shared'
import type { Ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { onElementRemoval } from '.'

describe('onElementRemoval', () => {
  let callBackFn: AnyFn
  let grandElement: Ref<HTMLElement>
  let parentElement: Ref<HTMLElement>
  let targetElement: Ref<HTMLElement>

  beforeEach(() => {
    callBackFn = vi.fn(m => expect(m[0]).toBeInstanceOf(MutationRecord))
    grandElement = ref(document.createElement('div'))
    parentElement = ref(document.createElement('div'))
    targetElement = ref(document.createElement('div'))

    parentElement.value.appendChild(targetElement.value)
    grandElement.value.appendChild(parentElement.value)
    document.body.appendChild(grandElement.value)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should be defined', () => {
    expect(onElementRemoval).toBeDefined()
  })

  it('should be called when the element is removed', async () => {
    onElementRemoval(targetElement, callBackFn)

    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(1)

    parentElement.value.appendChild(targetElement.value)
    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(2)

    parentElement.value.appendChild(targetElement.value)
    parentElement.value.innerHTML = ''
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(3)
  })

  it('should be called when any element containing the target element is removed', async () => {
    onElementRemoval(targetElement, callBackFn)

    grandElement.value.removeChild(parentElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(1)

    grandElement.value.appendChild(parentElement.value)
    grandElement.value.remove()
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(2)

    document.body.appendChild(grandElement.value)
    document.body.removeChild(grandElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(3)
  })

  it('should correctly triggered when use the custom document', async () => {
    const shadowRoot = grandElement.value.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(parentElement.value)

    onElementRemoval(targetElement, callBackFn, { document: shadowRoot })

    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(1)

    parentElement.value.appendChild(targetElement.value)
    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(2)

    parentElement.value.appendChild(targetElement.value)
    parentElement.value.innerHTML = ''
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(3)
  })

  it('should correctly triggered even if the element is assigned a value after initialization', async () => {
    const targetElement2 = ref()
    onElementRemoval(targetElement2, callBackFn)

    const el = document.createElement('div')
    targetElement2.value = el
    parentElement.value.appendChild(el)
    await nextTick()
    parentElement.value.removeChild(el)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(1)
  })

  it('should stop observing after called dispose scope', async () => {
    const scope = effectScope()
    scope.run(() => {
      onElementRemoval(targetElement, callBackFn)
    })
    scope.stop()

    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(0)
  })

  it('should stop observing after called the stop handle', async () => {
    const stop = onElementRemoval(targetElement, callBackFn)
    stop()

    parentElement.value.removeChild(targetElement.value)
    await nextTick()
    expect(callBackFn).toHaveBeenCalledTimes(0)
  })
})
