import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { useElementBySelector } from './index'

const App = defineComponent({
  template: `<template>
  <div class="test-element">Test element</div>
  </template>
  `,
})

describe('useElementBySelector', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App, {
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

  it('should get be empty with invalid selector', () => {
    const elementRef = useElementBySelector('.non-existing-class')
    expect(elementRef.value).toBeNull()
  })
})
