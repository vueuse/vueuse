import { expect } from 'vitest'
import { ref } from 'vue-demi'
import { useObjectTemplate } from '.'

const data = ref({
  key: 'keyValue',
  banana: 'bananaValue',
})

describe('useObjectTemplate', () => {
  it('work with template ref object', () => {
    const { template, reset } = useObjectTemplate(data)

    expect(template.value).toEqual(data.value)

    template.value.banana = 'apple'
    expect(template.value.banana).toEqual('apple')

    reset()

    expect(template.value).toEqual(data.value)
  })

  it('work with template object', () => {
    const { template, reset } = useObjectTemplate(data.value)

    expect(template.value).toEqual(data.value)

    template.value.banana = 'apple'
    expect(template.value.banana).toEqual('apple')

    reset()

    expect(template.value).toEqual(data.value)
  })
})
