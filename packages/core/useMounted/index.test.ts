import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, shallowRef } from 'vue'
import { useMounted } from './index'

describe('useMounted', () => {
  it('should be defined', () => {
    expect(useMounted).toBeDefined()
  })

  it('should return mounted state for current component instance', async () => {
    let isMounted: any

    const TestComponent = defineComponent({
      setup() {
        isMounted = useMounted()
        return {}
      },
      render() {
        return h('div', 'test')
      },
    })

    const wrapper = mount(TestComponent)

    await nextTick()

    // Should be mounted after component is mounted
    expect(isMounted.value).toBe(true)

    await nextTick()

    wrapper.unmount()
  })

  it('should return false when no target and no current instance', () => {
    // Test outside of component context
    const isMounted = useMounted()
    expect(isMounted.value).toBe(false)
  })

  it('should track element mount state with target parameter', async () => {
    let targetMounted: any
    const elementRef = shallowRef<HTMLElement>()

    const TestComponent = defineComponent({
      setup() {
        targetMounted = useMounted(elementRef)
        return { elementRef }
      },
      render() {
        return h('div', [
          h('div', { ref: 'elementRef' }, 'target element'),
        ])
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Should be true when element exists
    expect(targetMounted.value).toBe(true)

    wrapper.unmount()
  })

  it('should return false when target element is null/undefined', () => {
    const elementRef = shallowRef<HTMLElement>()
    const targetMounted = useMounted(elementRef)

    // elementRef.value is undefined initially
    expect(targetMounted.value).toBe(false)
  })

  it('should reactively track target element changes', async () => {
    const elementRef = shallowRef<HTMLElement>()
    const targetMounted = useMounted(elementRef)

    // Initially false
    expect(targetMounted.value).toBe(false)

    // Create and assign element
    const element = document.createElement('div')
    elementRef.value = element
    await nextTick()

    // Should be true when element is assigned
    expect(targetMounted.value).toBe(true)

    // Remove element
    elementRef.value = undefined as any
    await nextTick()

    // Should be false when element is removed
    expect(targetMounted.value).toBe(false)
  })

  it('should work with component instance as target', async () => {
    let targetMounted: any
    const componentRef = shallowRef()

    const TargetComponent = defineComponent({
      name: 'TargetComponent',
      render() {
        return h('div', 'target component')
      },
    })

    const TestComponent = defineComponent({
      components: { TargetComponent },
      setup() {
        targetMounted = useMounted(componentRef)
        return { componentRef }
      },
      render() {
        return h('div', [
          h(TargetComponent, { ref: 'componentRef' }),
        ])
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Should be true when component instance exists
    expect(targetMounted.value).toBe(true)

    wrapper.unmount()
  })

  it('should work with computed target', async () => {
    const showElement = shallowRef(true)
    const elementRef = shallowRef<HTMLElement>()
    const computedTarget = computed(() => showElement.value ? elementRef.value : null)
    const targetMounted = useMounted(computedTarget)

    // Initially false (elementRef is undefined)
    expect(targetMounted.value).toBe(false)

    // Create element
    const element = document.createElement('div')
    elementRef.value = element
    await nextTick()

    // Should be true when element exists and showElement is true
    expect(targetMounted.value).toBe(true)

    // Hide element via computed
    showElement.value = false
    await nextTick()

    // Should be false when computed returns null
    expect(targetMounted.value).toBe(false)

    // Show element again
    showElement.value = true
    await nextTick()

    // Should be true again
    expect(targetMounted.value).toBe(true)
  })

  it('should work with DOM element directly', () => {
    const element = document.createElement('div')
    const targetMounted = useMounted(shallowRef(element))

    // Should be true for existing DOM element
    expect(targetMounted.value).toBe(true)
  })
})
