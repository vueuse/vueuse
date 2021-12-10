
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
    console.log(state)

    expect(state.age).toBe(undefined)
    expect(state.name).toBe(undefined)
  })
})
