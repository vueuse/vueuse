import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Slot } from 'vue-demi'
import { Fragment, defineComponent, h, isVue2, renderSlot } from 'vue-demi'
import { createReusableTemplate } from '.'

describe.skipIf(isVue2)('createReusableTemplate', () => {
  it('should work', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate()
    const [DefineBar, ReuseBar] = createReusableTemplate()
    const Zig = createReusableTemplate()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => ['Foo']),
          h(ReuseFoo),

          h(DefineBar, () => ['Bar']),
          h(Zig.define, () => ['Zig']),
          h(ReuseFoo),
          h(ReuseBar),
          h(Zig.reuse),
        ])
      },
    })

    expect(wrapper.text()).toBe('FooFooBarZig')
  })

  it('nested', () => {
    const CompA = defineComponent((_, { slots }) => {
      return () => renderSlot(slots, 'default')
    })

    const [DefineFoo, ReuseFoo] = createReusableTemplate()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => ['Foo']),
          h(CompA, () => h(ReuseFoo)),
        ])
      },
    })

    expect(wrapper.text()).toBe('Foo')
  })

  it('props', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, ({ $slots, ...args }: any) => h('pre', JSON.stringify(args))),

          h(ReuseFoo, { msg: 'Foo' }),
          h(ReuseFoo, { msg: 'Bar' }),
        ])
      },
    })

    expect(wrapper.text()).toBe('{"msg":"Foo"}{"msg":"Bar"}')
  })

  it('attrs', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => h('div', { class: 'foo' })),
          h(ReuseFoo, { id: 'bar', class: 'bar' }),
        ])
      },
    })

    expect(wrapper.get('#bar')).toBeDefined()
    expect(wrapper.get('#bar').classes()).toEqual(['foo', 'bar'])
  })

  it('slots', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }, { default: Slot }>()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, (args: any) => args.$slots.default?.()),

          h(ReuseFoo, () => h('div', 'Goodbye')),
          h(ReuseFoo, () => h('div', 'Hi')),
        ])
      },
    })

    expect(wrapper.text()).toBe('GoodbyeHi')
  })

  it('hyphen props', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate<{ myMsg: string }>()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, ({ $slots, ...args }: any) => h('pre', JSON.stringify(args))),
          h(ReuseFoo, { myMsg: 'Foo' }),
          // @ts-expect-error Vue automatically converts hyphenized props to camelCase
          h(ReuseFoo, { 'my-msg': 'Bar' }),
        ])
      },
    })

    expect(wrapper.text()).toBe('{"myMsg":"Foo"}{"myMsg":"Bar"}')
  })
})
