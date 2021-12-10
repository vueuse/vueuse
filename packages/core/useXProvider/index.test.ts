
import { computed, defineComponent, h } from 'vue-demi'
import { mount } from '../../.test'
import { useXProvider } from '.'
describe('useXProvider', () => {
  it('should not work without instantiation of ProviderComponent', () => {
    interface IContext {
      name: string
      age: number
      action: Function
    }
    const defaultState = {
      name: 'hello',
      age: 20,
    }
    const providerFoundation = useXProvider<IContext>(defaultState)

    const state = providerFoundation.state

    expect(state.age).toBeUndefined()
    expect(state.name).toBeUndefined()
  })

  it('should work with partical types', () => {
    interface IContext {
      name: string
      age: number
      action: Function
    }
    const defaultState = {
      name: 'hello',
      age: 20,
    }
    const providerFoundation = useXProvider<IContext>(defaultState)
    const state = providerFoundation.state
    const useContext = providerFoundation.useConText

    const descendNode = defineComponent({
      setup() {
        const demoContext = useContext()
        const name = computed(() => demoContext.name)

        expect(name.value).toEqual(state.name)

        return {
          name,
        }
      },
      render() {
        return h('div')
      },
    })
    const vm = mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, h(descendNode))
      },
    }))

    console.log(vm.$refs[0])

    expect(state.age).toEqual(20)
    expect(state.name).toEqual('hello')
    expect(state.action).toBeUndefined()
  })
})
