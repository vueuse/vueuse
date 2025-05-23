import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { useElementBySelector } from './index'

const App = defineComponent({
  template: `<template>
  <div class="test-element">Test element</div>
  </template>
  `,
})

describe('useElementBySelector', () => {
  beforeEach(() => {
    mount(App, {
      attachTo: document.body,
    })
  })

  it('should be defined', () => {
    expect(useElementBySelector).toBeDefined()
  })

  it('should get element', () => {
    const elementRef = useElementBySelector('.test-element')
    expect(elementRef.value).toBeTruthy()
  })

  it('should reactively select element when selector updated', async () => {
    const selector = shallowRef('.test-element')
    const elementRef = useElementBySelector(selector)
    expect(elementRef.value).toBeTruthy()

    selector.value = 'body'
    await nextTick()

    expect(elementRef.value?.tagName).toBe('BODY')
  })

  it('should get be empty with invalid selector', () => {
    const elementRef = useElementBySelector('.non-existing-class')
    expect(elementRef.value).toBeNull()
  })
})
