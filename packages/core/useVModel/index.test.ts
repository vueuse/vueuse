import { isVue2 } from 'vue-demi'
import { useVModel } from '.'
import { useSetup } from '../../.test'

describe('useVModel', () => {
  it('should work with default value', () => {
    const props = {
      [isVue2 ? 'value' : 'modelValue']: 'default',
    }
    useSetup(() => {
      const data = useVModel(props)
      expect(data.value).toBe('default')
    })
  })

  it('should work with arguments', () => {
    const props = {
      [isVue2 ? 'value' : 'modelValue']: 'default',
      data: 'data',
    }
    useSetup(() => {
      const data = useVModel(props, 'data')
      expect(data.value).toBe('data')
    })
  })
})
