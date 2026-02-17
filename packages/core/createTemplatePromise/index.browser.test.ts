import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createTemplatePromise } from './index'

describe('createTemplatePromise', () => {
  it('should work', async () => {
    const str = 'Hello world' // <- expected arg to template
    const val = Math.random() // <- expected resolved value

    const wrapper = mount({
      setup() {
        const TemplatePromise = createTemplatePromise<number, [string]>()

        const onClick = async () => {
          const result = await TemplatePromise.start(str)

          expect(result).toBe(val)
        }

        return () => [
          h('button', { onClick }),
          h(TemplatePromise, null, {
            default: (ctx: any) => {
              ctx.resolve(val)

              return h('div', null, ctx.args[0])
            },
          }),
        ]
      },
    })

    expect(wrapper.text()).toBe('')

    wrapper.find('button').trigger('click')

    await nextTick()

    expect(wrapper.text()).toBe(str)
  })
})
