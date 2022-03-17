
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
    const useContext = providerFoundation.useContext

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

    mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, () => h(descendNode))
      },
    }))

    expect(state.age).toEqual(20)
    expect(state.name).toEqual('hello')
    expect(state.action).toBeUndefined()
  })
  it('should work with lazy initialized', () => {
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
    const useContext = providerFoundation.useContext
    const setState = providerFoundation.setState

    const descendNode = defineComponent({
      setup() {
        // recommend
        const demoContext = useContext()
        // unrecommend
        // const globalState = state

        const name = computed(() => demoContext.name)

        expect(name.value).toEqual('hello')

        setState({ name: 'world' })
        setState({ age: 30 })

        setState({
          action: () => {
            console.log('action worked')

            expect(state.name).toEqual('world')
            expect(demoContext.age).toEqual(30)
            expect(name.value).toEqual('world')
          },
        })

        demoContext.action()
        return {
          name,
        }
      },
      render() {
        return h('div')
      },
    })

    mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, () => h(descendNode))
      },
    }))
  })
  it('should support type-safe string dot notation', () => {
    interface IClothes {
      color: 'red' | 'blue' | 'black'
      size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
      material: 'silk' | 'cotton' | 'linen' | 'PET'
    }
    type TCarType = 'SUV' | 'MPV' | 'PHEV' | 'EV'
    interface ICar {
      brand: string
      types: { _type: TCarType }[]
    }
    const SYMKEY = Symbol.for('test')
    interface IPerson {
      [SYMKEY]: symbol
      name: string
      age: number
      action: VoidFunction
      id?: Symbol
      0?: Number
      '1'?: string
      clothes: {
        jacket: IClothes
        trousers: IClothes
      }
      cars: ICar[]
    }
    const cars = [
      { brand: 'byd' },
    ] as unknown as ICar[]
    const person = {
      name: 'phillyx',
      age: 20,
      action: () => {
        console.log('helloworld')
      },
      0: 0,
      clothes: {
        jacket: {
          size: 'XL',
          color: 'black',
        },
      },
      cars,
    } as unknown as IPerson
    const providerFoundation = useXProvider<IPerson>(person)
    const useContext = providerFoundation.useContext
    const setState = providerFoundation.setState

    const descendNode = defineComponent({
      setup() {
        const personContext = useContext()

        const name = computed(() => personContext.name)

        expect(name.value).toEqual('phillyx')

        setState('name', 'world')
        setState('age', 30)
        setState(0, 1000)
        setState('1', 'test number-string')
        setState('clothes.jacket.color', 'red')
        // support type-safe array dot notation
        setState('cars', [])
        setState('cars.0', { brand: 'byd-yuan', types: [{ _type: 'EV' }, { _type: 'SUV' }] })
        setState(`cars.${1}.brand`, 'byd-song')
        setState('cars.1.types.0', { _type: 'SUV' })

        setState({
          action: () => {
            console.log('action worked')
            expect(personContext.name).toEqual('world')
            expect(personContext.age).toEqual(30)
            expect(name.value).toEqual('world')
            expect(personContext[0]).toEqual(1000)
            expect(personContext[1]).toEqual('test number-string')

            expect(personContext.clothes.jacket.color).toEqual('red')

            expect(personContext.cars[0].types.length).toEqual(2)
            expect(personContext.cars[1].brand).toEqual('byd-song')
            expect(personContext.cars[1].types[0]._type).toEqual('SUV')
          },
        })
        personContext.action()
        return {
          name,
        }
      },
      render() {
        return h('div')
      },
    })

    mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, () => h(descendNode))
      },
    }))
  })
  it('should not work if U update state.props with `useContext` directly', () => {
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
    const useContext = providerFoundation.useContext

    const descendNode = defineComponent({
      setup() {
        // recommend
        const demoContext = useContext()

        const name = computed(() => demoContext.name)

        demoContext.name = 'world'
        // unrecommend, Later versions maybe privatize this property
        // instead of setState
        state.age = 30
        console.log('state.name is not changed')
        expect(demoContext.name).toEqual('hello')
        expect(demoContext.age).toEqual(30)
        return {
          name,
        }
      },
      render() {
        return h('div')
      },
    })

    mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, () => h(descendNode))
      },
    }))
  })

  it('should work with ProviderComponent.props set', () => {
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
    const useContext = providerFoundation.useContext

    const descendNode = defineComponent({
      setup() {
        // recommend
        const demoContext = useContext()

        const name = computed(() => demoContext.name)

        expect(name.value).toEqual('new world')
        return {
          name,
        }
      },
      render() {
        return h('div')
      },
    })

    mount(defineComponent({
      render() {
        return h(providerFoundation.ProviderComponent, { value: { name: 'new world' } }, () => h(descendNode))
      },
    }))
  })

  it('should not work afer ProviderComponent unmounted', () => {
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
    const useContext = providerFoundation.useContext
    const state = providerFoundation.state

    const descendNode = defineComponent({
      setup() {
        // recommend
        const demoContext = useContext()

        const name = computed(() => demoContext.name)

        expect(Object.keys(state).length > 0).toBeTruthy()
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
        return h(providerFoundation.ProviderComponent, { value: { name: 'new world' } }, () => h(descendNode))
      },
    }))

    setTimeout(() => {
      vm.unmount()
      expect(Object.keys(state).length).toBe(0)
    }, 3000)
  })
})
