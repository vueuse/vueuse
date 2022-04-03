import { defineComponent, nextTick, ref } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { promiseTimeout } from '@vueuse/shared'
import { useTypeAHead } from '.'

const AppTest1 = defineComponent({
  setup() {
    const testList = ref([
      { label: 'Amy', id: 'Amy' },
      { label: 'Ascy', id: 'Ascy' },
      { label: 'vl', id: 'Alqw' },
      { label: 'cmy', id: 'A2my' },
      { label: 'ccy', id: 'Acqwey' },
      { label: 'vscy', id: 'Asrcy' },
      { label: 'bty', id: 'Aqwty' },
      { label: 'bl', id: 'Aasdl' },
      { label: 'Acasy', id: 'wdcy' },
    ])
    const typeAHead = useTypeAHead(testList, 'label')
    const activeIndex = ref<number>(-1)
    const handleKeyDown = (e: KeyboardEvent) => {
      activeIndex.value = typeAHead.match()(e)
    }

    return {
      activeIndex,
      handleKeyDown,
    }
  },
  template: `
        {{activeIndex}}
        <input @keydown="(e)=>handleKeyDown(e)" data-test="element"/>
  `,
})
const AppTest2 = defineComponent({
  setup() {
    const testList = ref([
      { index: 0, label: 'Amy', id: 'Amy', __th_disabled: true },
      { index: 1, label: 'Ascy', id: 'Ascy' },
      { index: 2, label: 'Acy', id: 'Acy', __th_skip: true },
      { index: 3, label: 'Aty', id: 'Aty' },
      { index: 4, label: 'A s', id: 'Al' },
      { index: 5, label: 'Acys', id: 'Acy' },
      { index: 6, label: 'Acasy', id: 'wdcy', __th_skip: true },
    ])
    const typeAHead = useTypeAHead(testList, 'label')
    const activeIndex = ref<number>(-1)
    const handleKeyDown = (e: KeyboardEvent) => {
      activeIndex.value = typeAHead.match()(e)
    }

    return {
      activeIndex,
      handleKeyDown,
    }
  },
  template: `
        {{activeIndex}}
        <input @keydown="(e)=>handleKeyDown(e)" data-test="element"/>
  `,
})
describe('useTypeAHead', () => {
  let wrapper: VueWrapper<any>
  it('should be defined', () => {
    expect(useTypeAHead).toBeDefined()
  })
  it('Enter the same characters every 500ms ', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(0)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(8)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(0)
  })
  it('Enter different characters every 500ms ', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(0)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'KeyC', key: 'c' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(3)
    await element.trigger('keydown', { code: 'KeyV', key: 'v' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(2)
    await element.trigger('keydown', { code: 'KeyB', key: 'b' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(6)
  })
  it('Enter multiple identical characters in 500ms ', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    expect(wrapper.vm.activeIndex).toBe(0)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    expect(wrapper.vm.activeIndex).toBe(8)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    expect(wrapper.vm.activeIndex).toBe(0)
  })
  it('Input multiple different characters within 500ms', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await element.trigger('keydown', { code: 'KeyS', key: 's' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'KeyC', key: 'c' })
    await element.trigger('keydown', { code: 'KeyC', key: 'c' })
    await element.trigger('keydown', { code: 'KeyY', key: 'y' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(4)
    await element.trigger('keydown', { code: 'KeyQ', key: 'Q' })
    await element.trigger('keydown', { code: 'KeyE', key: 'e' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(-1)
  })
  it('Press backspace', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await element.trigger('keydown', { code: 'KeyS', key: 's' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'Backspace', key: 'backspace' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
  })
  it('Press ArrowDown and ArrowUp', async() => {
    wrapper = mount(AppTest1)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(0)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(2)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(3)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(4)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(5)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(6)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(7)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(8)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(0)

    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(8)
    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(7)
    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(6)
    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(5)
  })
  it('Disabled and Skip', async() => {
    wrapper = mount(AppTest2)
    await nextTick()
    wrapper.get('[data-test="element"]')
    const element = wrapper.get('[data-test=element]')
    await element.trigger('click')
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(3)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(4)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(5)
    await element.trigger('keydown', { code: 'KeyA', key: 'a' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)

    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(5)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    await promiseTimeout(500)
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(wrapper.vm.activeIndex).toBe(3)
    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(1)
    await element.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(wrapper.vm.activeIndex).toBe(5)
  })
})
